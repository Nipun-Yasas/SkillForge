import Credit from '@/models/Credit';
import CreditTransaction from '@/models/CreditTransaction';
import connectDB from '@/lib/mongodb';

export class CreditService {
  // Initialize credits for new user
  static async initializeCredits(userId: string) {
    await connectDB();
    
    const existingCredit = await Credit.findOne({ userId });
    if (existingCredit) return existingCredit;

    const newCredit = new Credit({
      userId,
      teachingCredits: 0,
      learningCredits: 0, // New users get 0 credits
      bonusCredits: 5,    // Welcome bonus
      reputation: 50,
      level: 'bronze',
      achievements: ['welcome'],
    });

    await newCredit.save();
    
    // Record welcome bonus transaction
    await this.recordTransaction({
      userId,
      type: 'bonus',
      amount: 5,
      creditType: 'bonus',
      description: 'Welcome bonus credits',
      status: 'completed',
    });

    return newCredit;
  }

  // Award teaching credits after session completion
  static async awardTeachingCredits(teacherId: string, sessionData: {
    duration: number;        // in hours
    rating: number;         // 1-5 stars
    skill: string;
    studentId: string;
    sessionId: string;
  }) {
    await connectDB();
    
    const { duration, rating, skill, studentId, sessionId } = sessionData;
    
    // Base credits = duration in hours
    let creditsEarned = duration;
    
    // Bonus based on rating (5 stars = +20% credits)
    const ratingBonus = (rating - 3) * 0.1; // -20% to +20%
    creditsEarned = creditsEarned * (1 + ratingBonus);
    
    // Round to 2 decimal places
    creditsEarned = Math.round(creditsEarned * 100) / 100;

    // Update teacher's credits
    const teacherCredit = await Credit.findOne({ userId: teacherId });
    if (!teacherCredit) throw new Error('Teacher credits not found');

    teacherCredit.teachingCredits += creditsEarned;
    teacherCredit.totalEarned += creditsEarned;
    
    // Update reputation based on rating
    teacherCredit.reputation = this.calculateNewReputation(
      teacherCredit.reputation, 
      rating, 
      teacherCredit.totalEarned
    );
    
    // Check for level progression
    teacherCredit.level = this.calculateLevel(teacherCredit.totalEarned);
    
    await teacherCredit.save();

    // Record transaction
    await this.recordTransaction({
      userId: teacherId,
      sessionId,
      type: 'earned',
      amount: creditsEarned,
      creditType: 'teaching',
      description: `Teaching session: ${skill}`,
      relatedUserId: studentId,
      metadata: {
        sessionDuration: duration,
        rating,
        skill,
      },
    });

    return { creditsEarned, newReputation: teacherCredit.reputation };
  }

  // Spend learning credits for session booking
  static async spendLearningCredits(studentId: string, sessionData: {
    duration: number;
    cost: number;
    skill: string;
    teacherId: string;
    sessionId: string;
  }) {
    await connectDB();
    
    const { duration, cost, skill, teacherId, sessionId } = sessionData;
    
    const studentCredit = await Credit.findOne({ userId: studentId });
    if (!studentCredit) throw new Error('Student credits not found');

    // Check if student has enough credits
    const totalAvailable = studentCredit.learningCredits + studentCredit.bonusCredits;
    if (totalAvailable < cost) {
      throw new Error('Insufficient credits');
    }

    // Deduct credits (bonus first, then learning)
    let remaining = cost;
    let bonusUsed = 0;
    let learningUsed = 0;

    if (studentCredit.bonusCredits >= remaining) {
      bonusUsed = remaining;
      studentCredit.bonusCredits -= remaining;
    } else {
      bonusUsed = studentCredit.bonusCredits;
      studentCredit.bonusCredits = 0;
      remaining -= bonusUsed;
      learningUsed = remaining;
      studentCredit.learningCredits -= remaining;
    }

    studentCredit.totalSpent += cost;
    await studentCredit.save();

    // Record transaction
    await this.recordTransaction({
      userId: studentId,
      sessionId,
      type: 'spent',
      amount: cost,
      creditType: 'learning',
      description: `Learning session: ${skill}`,
      relatedUserId: teacherId,
      metadata: {
        sessionDuration: duration,
        skill,
      },
    });

    return { 
      spent: cost, 
      bonusUsed, 
      learningUsed, 
      remainingCredits: studentCredit.learningCredits + studentCredit.bonusCredits 
    };
  }

  // Transfer credits between users (barter system)
  static async transferCredits(fromUserId: string, toUserId: string, amount: number, skill: string) {
    await connectDB();
    
    const fromCredit = await Credit.findOne({ userId: fromUserId });
    const toCredit = await Credit.findOne({ userId: toUserId });
    
    if (!fromCredit || !toCredit) {
      throw new Error('User credits not found');
    }

    // Check if sender has enough teaching credits
    if (fromCredit.teachingCredits < amount) {
      throw new Error('Insufficient teaching credits');
    }

    // Transfer credits
    fromCredit.teachingCredits -= amount;
    toCredit.learningCredits += amount;

    await fromCredit.save();
    await toCredit.save();

    // Record transactions
    await Promise.all([
      this.recordTransaction({
        userId: fromUserId,
        type: 'spent',
        amount,
        creditType: 'teaching',
        description: `Credit transfer to user for ${skill}`,
        relatedUserId: toUserId,
      }),
      this.recordTransaction({
        userId: toUserId,
        type: 'earned',
        amount,
        creditType: 'learning',
        description: `Credit received from user for ${skill}`,
        relatedUserId: fromUserId,
      }),
    ]);

    return { success: true };
  }

  // Purchase credits with money
  static async purchaseCredits(userId: string, amount: number, paymentMethod: string) {
    await connectDB();
    
    const userCredit = await Credit.findOne({ userId });
    if (!userCredit) throw new Error('User credits not found');

    userCredit.learningCredits += amount;
    await userCredit.save();

    await this.recordTransaction({
      userId,
      type: 'purchase',
      amount,
      creditType: 'learning',
      description: `Purchased ${amount} learning credits`,
      metadata: { paymentMethod },
    });

    return { newBalance: userCredit.learningCredits + userCredit.bonusCredits };
  }

  // Helper methods
  private static calculateNewReputation(currentRep: number, newRating: number, totalSessions: number): number {
    // Weighted average with more weight on recent sessions
    const weight = Math.min(totalSessions / 10, 1); // Max weight at 10 sessions
    const ratingScore = (newRating / 5) * 100; // Convert 1-5 to 0-100
    
    const newRep = (currentRep * (1 - weight * 0.1)) + (ratingScore * weight * 0.1);
    return Math.round(Math.min(Math.max(newRep, 0), 100));
  }

  private static calculateLevel(totalEarned: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (totalEarned >= 100) return 'platinum';
    if (totalEarned >= 50) return 'gold';
    if (totalEarned >= 20) return 'silver';
    return 'bronze';
  }

  private static async recordTransaction(transaction: {
    userId: string;
    sessionId?: string;
    type: 'earned' | 'spent' | 'bonus' | 'purchase' | 'refund';
    amount: number;
    creditType: 'teaching' | 'learning' | 'bonus';
    description: string;
    relatedUserId?: string;
    status?: 'pending' | 'completed' | 'failed';
    metadata?: {
      sessionDuration?: number;
      rating?: number;
      skill?: string;
      paymentMethod?: string;
    };
  }) {
    const newTransaction = new CreditTransaction(transaction);
    await newTransaction.save();
    return newTransaction;
  }

  // Get user's credit summary
  static async getCreditSummary(userId: string) {
    await connectDB();
    
    const credit = await Credit.findOne({ userId });
    if (!credit) return null;

    const recentTransactions = await CreditTransaction
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('relatedUserId', 'name')
      .lean();

    return {
      ...credit.toObject(),
      totalCredits: credit.learningCredits + credit.bonusCredits,
      recentTransactions,
    };
  }

  // Convert teaching credits to learning credits
  static async convertTeachingToLearning(userId: string, amount: number) {
    await connectDB();
    
    const userCredit = await Credit.findOne({ userId });
    if (!userCredit) throw new Error('User credits not found');

    // Check if user has enough teaching credits
    if (userCredit.teachingCredits < amount) {
      throw new Error('Insufficient teaching credits');
    }

    // Convert credits (1:1 ratio)
    userCredit.teachingCredits -= amount;
    userCredit.learningCredits += amount;
    await userCredit.save();

    // Record the conversion transaction
    const transaction = new CreditTransaction({
      userId,
      type: 'spent',
      amount,
      creditType: 'teaching',
      description: `Converted ${amount} teaching credits to learning credits`,
      status: 'completed',
      metadata: {
        conversionType: 'teaching-to-learning',
        conversionAmount: amount,
      },
    });
    await transaction.save();

    // Record the receiving transaction
    const receivingTransaction = new CreditTransaction({
      userId,
      type: 'earned',
      amount,
      creditType: 'learning',
      description: `Received ${amount} learning credits from conversion`,
      status: 'completed',
      metadata: {
        conversionType: 'teaching-to-learning',
        conversionAmount: amount,
      },
    });
    await receivingTransaction.save();

    return {
      teachingCredits: userCredit.teachingCredits,
      learningCredits: userCredit.learningCredits,
      convertedAmount: amount,
    };
  }

  // Purchase learning credits with money (premium feature)
  static async purchaseLearningCredits(userId: string, amount: number, paymentData: {
    paymentMethod: string;
    transactionId: string;
    amountPaid: number;
  }) {
    await connectDB();
    
    const userCredit = await Credit.findOne({ userId });
    if (!userCredit) throw new Error('User credits not found');

    const { paymentMethod, transactionId, amountPaid } = paymentData;

    // Add purchased credits
    userCredit.learningCredits += amount;
    await userCredit.save();

    // Record the purchase transaction
    const transaction = new CreditTransaction({
      userId,
      type: 'earned',
      amount,
      creditType: 'learning',
      description: `Purchased ${amount} learning credits for $${amountPaid}`,
      status: 'completed',
      metadata: {
        paymentMethod,
        transactionId,
        amountPaid,
        pricePerCredit: amountPaid / amount,
      },
    });
    await transaction.save();

    return {
      learningCredits: userCredit.learningCredits,
      purchasedAmount: amount,
      amountPaid,
    };
  }

  // Award bonus credits for achievements
  static async awardBonusCredits(userId: string, amount: number, reason: string) {
    await connectDB();
    
    const userCredit = await Credit.findOne({ userId });
    if (!userCredit) throw new Error('User credits not found');

    // Add bonus credits
    userCredit.bonusCredits += amount;
    await userCredit.save();

    // Record the bonus transaction
    const transaction = new CreditTransaction({
      userId,
      type: 'bonus',
      amount,
      creditType: 'bonus',
      description: `Bonus: ${reason}`,
      status: 'completed',
      metadata: {
        bonusReason: reason,
      },
    });
    await transaction.save();

    return {
      bonusCredits: userCredit.bonusCredits,
      awardedAmount: amount,
    };
  }
}

export default CreditService;

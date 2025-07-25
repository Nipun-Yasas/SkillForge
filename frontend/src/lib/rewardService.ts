import connectDB from '@/lib/mongodb';
import Credit from '@/models/Credit';
import User from '@/models/User';
import CreditTransaction from '@/models/CreditTransaction';

interface CreditData {
  teachingCredits: number;
  reputation: number;
  level: string;
  totalEarned: number;
  achievements: string[];
}

interface UserData {
  _id: string;
  name: string;
  university?: string;
  skills?: {
    teaching?: string[];
  };
}

interface TeacherReward {
  type: 'cash' | 'academic-credits' | 'certificate' | 'priority-access' | 'networking';
  value: number | string;
  description: string;
  eligibilityMet: boolean;
  estimatedValue?: number; // in USD
}

export class RewardService {
  
  // Get available rewards for a teacher
  static async getAvailableRewards(teacherId: string): Promise<TeacherReward[]> {
    await connectDB();
    
    const teacherCredit = await Credit.findOne({ userId: teacherId });
    const teacher = await User.findById(teacherId);
    
    if (!teacherCredit || !teacher) {
      throw new Error('Teacher not found');
    }

    const rewards: TeacherReward[] = [];

    // 1. Cash Rewards (Convert teaching credits to money)
    if (teacherCredit.teachingCredits >= 10) {
      const cashValue = this.calculateCashValue(teacherCredit.teachingCredits, teacherCredit.reputation);
      rewards.push({
        type: 'cash',
        value: cashValue,
        description: `Convert ${teacherCredit.teachingCredits} teaching credits to $${cashValue}`,
        eligibilityMet: true,
        estimatedValue: cashValue,
      });
    }

    // 2. Academic Credits
    if (teacherCredit.totalEarned >= 20) {
      rewards.push({
        type: 'academic-credits',
        value: Math.floor(teacherCredit.totalEarned / 10), // 1 academic credit per 10 teaching hours
        description: `Earn ${Math.floor(teacherCredit.totalEarned / 10)} academic credits for teaching`,
        eligibilityMet: teacher.university ? true : false,
        estimatedValue: Math.floor(teacherCredit.totalEarned / 10) * 500, // $500 value per academic credit
      });
    }

    // 3. Teaching Certificate
    if (teacherCredit.reputation >= 75 && teacherCredit.totalEarned >= 25) {
      rewards.push({
        type: 'certificate',
        value: 'Advanced Teaching Certificate',
        description: 'Official SkillForge Advanced Teaching Certificate',
        eligibilityMet: true,
        estimatedValue: 200,
      });
    }

    // 4. Priority Access & Benefits
    if (teacherCredit.level === 'gold' || teacherCredit.level === 'platinum') {
      rewards.push({
        type: 'priority-access',
        value: 'Premium Teacher Status',
        description: 'Priority matching, early feature access, reduced platform fees',
        eligibilityMet: true,
        estimatedValue: 100,
      });
    }

    // 5. Industry Networking Opportunities
    if (teacherCredit.reputation >= 85 && teacherCredit.achievements?.includes('mentor-50')) {
      rewards.push({
        type: 'networking',
        value: 'Industry Connections',
        description: 'Access to industry networking events and job opportunities',
        eligibilityMet: true,
        estimatedValue: 500,
      });
    }

    return rewards;
  }

  // Redeem cash reward
  static async redeemCashReward(teacherId: string, amount: number, paymentMethod: string) {
    await connectDB();
    
    const teacherCredit = await Credit.findOne({ userId: teacherId });
    if (!teacherCredit) {
      throw new Error('Teacher not found');
    }

    // Calculate credits needed for cash amount
    const creditsNeeded = this.calculateCreditsForCash(amount, teacherCredit.reputation);
    
    if (teacherCredit.teachingCredits < creditsNeeded) {
      throw new Error('Insufficient teaching credits');
    }

    // Deduct credits
    teacherCredit.teachingCredits -= creditsNeeded;
    await teacherCredit.save();

    // Record transaction
    await this.recordRewardTransaction(teacherId, {
      type: 'cash-redemption',
      amount: creditsNeeded,
      value: amount,
      description: `Cashed out ${creditsNeeded} credits for $${amount}`,
      method: paymentMethod,
    });

    // In a real implementation, integrate with payment processor (Stripe, PayPal, etc.)
    await this.processCashPayment(teacherId, amount, paymentMethod);

    return {
      success: true,
      cashAmount: amount,
      creditsUsed: creditsNeeded,
      remainingCredits: teacherCredit.teachingCredits,
    };
  }

  // Redeem academic credits
  static async redeemAcademicCredits(teacherId: string, institution: string) {
    await connectDB();
    
    const teacherCredit = await Credit.findOne({ userId: teacherId });
    const teacher = await User.findById(teacherId);
    
    if (!teacherCredit || !teacher) {
      throw new Error('Teacher not found');
    }

    const academicCredits = Math.floor(teacherCredit.totalEarned / 10);
    
    if (academicCredits < 1) {
      throw new Error('Not enough teaching hours for academic credits');
    }

    // Update teacher profile
    teacher.university = institution;
    await teacher.save();

    // Record transaction
    await this.recordRewardTransaction(teacherId, {
      type: 'academic-credits',
      amount: academicCredits,
      value: academicCredits,
      description: `Earned ${academicCredits} academic credits at ${institution}`,
      method: 'academic-transfer',
    });

    // Generate academic credit certificate/document
    const certificate = await this.generateAcademicCertificate(teacher, academicCredits, institution);

    return {
      success: true,
      academicCredits,
      institution,
      certificate,
    };
  }

  // Issue teaching certificate
  static async issueTeachingCertificate(teacherId: string, certificateType: string) {
    await connectDB();
    
    const teacherCredit = await Credit.findOne({ userId: teacherId });
    const teacher = await User.findById(teacherId);
    
    if (!teacherCredit || !teacher) {
      throw new Error('Teacher not found');
    }

    // Verify eligibility
    const eligible = this.checkCertificateEligibility(teacherCredit, certificateType);
    if (!eligible) {
      throw new Error('Not eligible for this certificate');
    }

    // Generate certificate
    const certificate = await this.generateTeachingCertificate(teacher, teacherCredit, certificateType);

    // Add to teacher's achievements
    if (!teacherCredit.achievements.includes(`certificate-${certificateType}`)) {
      teacherCredit.achievements.push(`certificate-${certificateType}`);
      await teacherCredit.save();
    }

    // Record transaction
    await this.recordRewardTransaction(teacherId, {
      type: 'certificate',
      amount: 1,
      value: certificateType,
      description: `Earned ${certificateType} Teaching Certificate`,
      method: 'achievement',
    });

    return {
      success: true,
      certificate,
      achievementUnlocked: `certificate-${certificateType}`,
    };
  }

  // Helper Methods
  private static calculateCashValue(teachingCredits: number, reputation: number): number {
    // Base rate: $10 per teaching credit
    let baseValue = teachingCredits * 10;
    
    // Reputation bonus (50-100 reputation = 0% to 50% bonus)
    const reputationBonus = Math.max(0, (reputation - 50) / 100);
    baseValue = baseValue * (1 + reputationBonus);
    
    return Math.round(baseValue * 100) / 100;
  }

  private static calculateCreditsForCash(cashAmount: number, reputation: number): number {
    const baseRate = 10; // $10 per credit
    const reputationBonus = Math.max(0, (reputation - 50) / 100);
    const effectiveRate = baseRate * (1 + reputationBonus);
    
    return Math.ceil(cashAmount / effectiveRate);
  }

  private static checkCertificateEligibility(teacherCredit: CreditData, certificateType: string): boolean {
    switch (certificateType) {
      case 'basic':
        return teacherCredit.totalEarned >= 10 && teacherCredit.reputation >= 60;
      case 'advanced':
        return teacherCredit.totalEarned >= 25 && teacherCredit.reputation >= 75;
      case 'expert':
        return teacherCredit.totalEarned >= 50 && teacherCredit.reputation >= 85;
      default:
        return false;
    }
  }

  private static async generateTeachingCertificate(teacher: UserData, teacherCredit: CreditData, type: string) {
    // Generate a unique certificate ID and document
    const certificateId = `SF-CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: certificateId,
      recipientName: teacher.name,
      certificateType: type,
      issuedDate: new Date(),
      totalHoursTaught: teacherCredit.totalEarned,
      averageRating: teacherCredit.reputation / 20, // Convert to 5-star scale
      skills: teacher.skills?.teaching || [],
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      verificationUrl: `https://skillforge.com/verify/${certificateId}`,
    };
  }

  private static async generateAcademicCertificate(teacher: UserData, credits: number, institution: string) {
    const certificateId = `SF-ACAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: certificateId,
      studentName: teacher.name,
      institution,
      creditsEarned: credits,
      subject: 'Peer Teaching and Mentorship',
      issuedDate: new Date(),
      academicYear: new Date().getFullYear(),
      verificationUrl: `https://skillforge.com/verify/academic/${certificateId}`,
    };
  }

  private static async processCashPayment(teacherId: string, amount: number, method: string) {
    // Integration with payment processors would go here
    // For now, just log the payment request
    console.log(`Processing $${amount} payment to teacher ${teacherId} via ${method}`);
    
    // In real implementation:
    // - Integrate with Stripe, PayPal, or bank transfer APIs
    // - Handle payment processing and verification
    // - Send payment confirmation emails
    // - Update payment status in database
    
    return {
      transactionId: `PAY-${Date.now()}`,
      status: 'processed',
      method,
      amount,
    };
  }

  private static async recordRewardTransaction(teacherId: string, reward: {
    type: string;
    amount: number;
    value: number | string;
    description: string;
    method: string;
  }) {
    const transaction = new CreditTransaction({
      userId: teacherId,
      type: 'spent', // Teacher is spending credits for rewards
      amount: reward.amount,
      creditType: 'teaching',
      description: reward.description,
      metadata: {
        rewardType: reward.type,
        rewardValue: reward.value,
        rewardMethod: reward.method,
      },
    });

    await transaction.save();
    return transaction;
  }

  // Get teacher's reward history
  static async getRewardHistory(teacherId: string) {
    await connectDB();
    
    const rewardTransactions = await CreditTransaction.find({
      userId: teacherId,
      'metadata.rewardType': { $exists: true },
    }).sort({ createdAt: -1 }).lean();

    return rewardTransactions.map(tx => ({
      id: tx._id,
      type: tx.metadata?.rewardType,
      amount: tx.amount,
      value: tx.metadata?.rewardValue,
      description: tx.description,
      date: tx.createdAt,
      status: tx.status,
    }));
  }

  // Calculate total reward value earned
  static async calculateTotalRewardValue(teacherId: string): Promise<number> {
    await connectDB();
    
    const rewardTransactions = await CreditTransaction.find({
      userId: teacherId,
      'metadata.rewardType': { $exists: true },
      status: 'completed',
    }).lean();

    let totalValue = 0;
    
    for (const tx of rewardTransactions) {
      switch (tx.metadata?.rewardType) {
        case 'cash-redemption':
          totalValue += Number(tx.metadata?.rewardValue) || 0;
          break;
        case 'academic-credits':
          totalValue += (Number(tx.metadata?.rewardValue) || 0) * 500; // $500 per academic credit
          break;
        case 'certificate':
          totalValue += 200; // $200 value per certificate
          break;
        default:
          totalValue += 0;
      }
    }

    return totalValue;
  }
}

export default RewardService;

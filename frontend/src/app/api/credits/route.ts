import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Credit from '@/models/Credit';
import CreditTransaction from '@/models/CreditTransaction';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    const userId = decoded.userId;

    await connectDB();

    // Get user's credit information
    let creditInfo = await Credit.findOne({ userId }).lean();
    
    // If no credit record exists, create one
    if (!creditInfo) {
      const newCredit = new Credit({
        userId,
        teachingCredits: 0,
        learningCredits: 10, // Welcome bonus
        bonusCredits: 0,
        reputation: 50,
        level: 'bronze',
        totalEarned: 0,
        totalSpent: 0,
        achievements: [],
      });
      await newCredit.save();
      creditInfo = newCredit.toObject();
    }

    // Get recent transactions
    const transactions = await CreditTransaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        creditInfo,
        transactions: transactions.map(tx => ({
          id: tx._id,
          type: tx.type,
          amount: tx.amount,
          creditType: tx.creditType,
          description: tx.description,
          date: tx.createdAt,
          status: tx.status,
        })),
      },
    });

  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit information' },
      { status: 500 }
    );
  }
}

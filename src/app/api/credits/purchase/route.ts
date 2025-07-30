import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { CreditService } from '@/lib/creditService';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    const userId = decoded.userId;

    const body = await request.json();
    const { amount, paymentMethod, transactionId, amountPaid } = body;

    if (!amount || amount <= 0 || !paymentMethod || !transactionId || !amountPaid) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Process credit purchase
    const result = await CreditService.purchaseLearningCredits(userId, amount, {
      paymentMethod,
      transactionId,
      amountPaid,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${amount} learning credits`,
      data: result,
    });

  } catch (error) {
    console.error('Error purchasing credits:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to purchase credits' },
      { status: 500 }
    );
  }
}

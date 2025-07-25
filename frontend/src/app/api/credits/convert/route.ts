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
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Convert teaching credits to learning credits
    const result = await CreditService.convertTeachingToLearning(userId, amount);

    return NextResponse.json({
      success: true,
      message: `Successfully converted ${amount} teaching credits to learning credits`,
      data: result,
    });

  } catch (error) {
    console.error('Error converting credits:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to convert credits' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Credit from '@/models/Credit';
import User from '@/models/User';
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
    const senderId = decoded.userId;

    const body = await request.json();
    const { recipientEmail, amount, message } = body;

    if (!recipientEmail || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid transfer details' }, { status: 400 });
    }

    await connectDB();

    // Find recipient by email
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    if (recipient._id.toString() === senderId) {
      return NextResponse.json({ error: 'Cannot transfer credits to yourself' }, { status: 400 });
    }

    // Check sender's credit balance
    const senderCredit = await Credit.findOne({ userId: senderId });
    if (!senderCredit || senderCredit.teachingCredits < amount) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // Perform the transfer using CreditService
    await CreditService.transferCredits(senderId, recipient._id.toString(), amount, message || 'Credit transfer');

    return NextResponse.json({
      success: true,
      message: `Successfully transferred ${amount} credits to ${recipient.name}`,
      data: {
        recipient: {
          name: recipient.name,
          email: recipient.email,
        },
        amount,
        message,
      },
    });

  } catch (error) {
    console.error('Error transferring credits:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to transfer credits' },
      { status: 500 }
    );
  }
}

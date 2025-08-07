import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
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
    const studentId = decoded.userId;

    const body = await request.json();
    const { teacherId, subject, sessionType, duration, scheduledDate, notes } = body;

    if (!teacherId || !subject || !sessionType || !duration || !scheduledDate) {
      return NextResponse.json({ error: 'Missing required booking details' }, { status: 400 });
    }

    await connectDB();

    // Calculate credit cost based on session duration and type
    let creditCost = Math.ceil(duration / 30); // Base: 1 credit per 30 minutes
    
    // Adjust cost based on session type
    switch (sessionType) {
      case 'group':
        creditCost = Math.ceil(creditCost * 0.7); // 30% discount for group sessions
        break;
      case 'premium':
        creditCost = Math.ceil(creditCost * 1.5); // 50% premium for advanced sessions
        break;
      case 'exam-prep':
        creditCost = Math.ceil(creditCost * 1.3); // 30% premium for exam prep
        break;
      default: // 'individual'
        break;
    }

    // Check if student has enough learning credits
    const studentCredit = await Credit.findOne({ userId: studentId });
    if (!studentCredit || studentCredit.learningCredits < creditCost) {
      return NextResponse.json({ 
        error: 'Insufficient learning credits',
        required: creditCost,
        available: studentCredit?.learningCredits || 0
      }, { status: 400 });
    }

    // Verify teacher exists and is available
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Check for scheduling conflicts
    const existingSession = await Session.findOne({
      $or: [
        { teacherId, scheduledDate, status: { $in: ['scheduled', 'in-progress'] } },
        { studentId, scheduledDate, status: { $in: ['scheduled', 'in-progress'] } }
      ]
    });

    if (existingSession) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 409 });
    }

    // Create the session
    const session = new Session({
      teacherId,
      studentId,
      subject,
      sessionType,
      duration,
      scheduledDate: new Date(scheduledDate),
      status: 'scheduled',
      creditCost,
      notes: notes || '',
      createdAt: new Date(),
    });

    await session.save();

    // Deduct learning credits from student
    await CreditService.spendLearningCredits(studentId, {
      duration,
      cost: creditCost,
      skill: subject,
      teacherId,
      sessionId: session._id.toString(),
    });

    // Get updated credit info
    const updatedCredit = await Credit.findOne({ userId: studentId });

    return NextResponse.json({
      success: true,
      message: 'Session booked successfully!',
      data: {
        sessionId: session._id,
        creditCost,
        remainingCredits: updatedCredit?.learningCredits || 0,
        session: {
          id: session._id,
          teacher: {
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
          },
          subject,
          sessionType,
          duration,
          scheduledDate,
          status: session.status,
        },
      },
    });

  } catch (error) {
    console.error('Error booking session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to book session' },
      { status: 500 }
    );
  }
}

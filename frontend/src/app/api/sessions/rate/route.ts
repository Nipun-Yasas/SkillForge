import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import Credit from '@/models/Credit';
import CreditService from '@/lib/creditService';
import jwt from 'jsonwebtoken';

interface SessionRating {
  sessionId: string;
  rating: number; // 1-5 stars
  feedback: string;
  ratingDetails?: {
    teachingQuality?: number;
    punctuality?: number;
    preparedness?: number;
    communication?: number;
    helpfulness?: number;
  };
  learningOutcomes?: string[];
  wouldRecommend?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    const token = request.cookies.get('token')?.value || authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const body: SessionRating = await request.json();
    const { 
      sessionId, 
      rating, 
      feedback, 
      ratingDetails, 
      learningOutcomes, 
      wouldRecommend 
    } = body;

    // Validate input
    if (!sessionId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Valid session ID and rating (1-5) are required' },
        { status: 400 }
      );
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Check if user is part of this session
    const isTeacher = session.teacherId.toString() === userId;
    const isStudent = session.studentId.toString() === userId;

    if (!isTeacher && !isStudent) {
      return NextResponse.json(
        { error: 'You are not authorized to rate this session' },
        { status: 403 }
      );
    }

    // Check if session is completed
    if (session.status !== 'completed') {
      return NextResponse.json(
        { error: 'Can only rate completed sessions' },
        { status: 400 }
      );
    }

    // Check if already rated
    if (isTeacher && session.teacherRating) {
      return NextResponse.json(
        { error: 'You have already rated this session' },
        { status: 400 }
      );
    }

    if (isStudent && session.studentRating) {
      return NextResponse.json(
        { error: 'You have already rated this session' },
        { status: 400 }
      );
    }

    // Update session with rating
    if (isTeacher) {
      session.teacherRating = rating;
      session.teacherFeedback = feedback;
    } else {
      session.studentRating = rating;
      session.studentFeedback = feedback;
      if (learningOutcomes) {
        session.learningOutcomes = learningOutcomes;
      }
    }

    await session.save();

    // If student rated teacher, update teacher's reputation and potentially award credits
    if (isStudent) {
      await updateTeacherReputation(session.teacherId.toString(), rating, ratingDetails);
      
      // Award teaching credits if not already done
      if (!session.teacherRating && session.paymentType !== 'free') {
        await CreditService.awardTeachingCredits(session.teacherId.toString(), {
          duration: session.duration,
          rating,
          skill: session.skill,
          studentId: session.studentId.toString(),
          sessionId: session._id.toString(),
        });
      }
    }

    // Calculate completion bonus if both users have rated
    if (session.teacherRating && session.studentRating) {
      await awardCompletionBonus(session);
    }

    return NextResponse.json({
      message: 'Rating submitted successfully',
      session: {
        _id: session._id,
        teacherRating: session.teacherRating,
        studentRating: session.studentRating,
        status: session.status,
      },
    });

  } catch (error) {
    console.error('Session rating error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update teacher reputation
async function updateTeacherReputation(
  teacherId: string, 
  rating: number, 
  ratingDetails?: any
) {
  const teacherCredit = await Credit.findOne({ userId: teacherId });
  if (!teacherCredit) return;

  // Calculate weighted reputation update
  const sessionWeight = Math.min(teacherCredit.totalEarned / 20, 1); // Max weight at 20 sessions
  const ratingScore = (rating / 5) * 100; // Convert to 0-100 scale
  
  // Update reputation using exponential moving average
  const alpha = 0.1 + (sessionWeight * 0.1); // Learning rate increases with experience
  teacherCredit.reputation = Math.round(
    teacherCredit.reputation * (1 - alpha) + ratingScore * alpha
  );

  // Ensure reputation stays within bounds
  teacherCredit.reputation = Math.max(0, Math.min(100, teacherCredit.reputation));

  // Update level based on reputation and total sessions
  updateTeacherLevel(teacherCredit);

  // Add achievements based on milestones
  checkAchievements(teacherCredit, rating, ratingDetails);

  await teacherCredit.save();
}

// Helper function to update teacher level
function updateTeacherLevel(teacherCredit: any) {
  const { totalEarned, reputation } = teacherCredit;
  
  // Level requirements: sessions + reputation
  if (totalEarned >= 100 && reputation >= 85) {
    teacherCredit.level = 'platinum';
  } else if (totalEarned >= 50 && reputation >= 75) {
    teacherCredit.level = 'gold';
  } else if (totalEarned >= 20 && reputation >= 65) {
    teacherCredit.level = 'silver';
  } else {
    teacherCredit.level = 'bronze';
  }
}

// Helper function to check and award achievements
function checkAchievements(teacherCredit: any, rating: number, ratingDetails?: any) {
  const achievements = teacherCredit.achievements || [];

  // Perfect rating achievement
  if (rating === 5 && !achievements.includes('perfect-rating')) {
    achievements.push('perfect-rating');
  }

  // Consistent excellence (10 sessions with 4+ rating)
  if (teacherCredit.reputation >= 80 && teacherCredit.totalEarned >= 10 && 
      !achievements.includes('consistent-excellence')) {
    achievements.push('consistent-excellence');
  }

  // Milestone achievements
  const milestones = [
    { sessions: 10, badge: 'mentor-10' },
    { sessions: 25, badge: 'mentor-25' },
    { sessions: 50, badge: 'mentor-50' },
    { sessions: 100, badge: 'mentor-100' },
  ];

  for (const milestone of milestones) {
    if (teacherCredit.totalEarned >= milestone.sessions && 
        !achievements.includes(milestone.badge)) {
      achievements.push(milestone.badge);
    }
  }

  teacherCredit.achievements = achievements;
}

// Helper function to award completion bonus
async function awardCompletionBonus(session: any) {
  const avgRating = (session.teacherRating + session.studentRating) / 2;
  
  // Award bonus credits for high-quality sessions (4+ stars average)
  if (avgRating >= 4) {
    const bonusAmount = Math.round(session.duration * 0.2); // 20% bonus
    
    // Award bonus to teacher
    const teacherCredit = await Credit.findOne({ userId: session.teacherId });
    if (teacherCredit) {
      teacherCredit.bonusCredits += bonusAmount;
      await teacherCredit.save();
    }

    // Award smaller bonus to student for good participation
    const studentCredit = await Credit.findOne({ userId: session.studentId });
    if (studentCredit) {
      studentCredit.bonusCredits += Math.round(bonusAmount * 0.5);
      await studentCredit.save();
    }
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import RewardService from '@/lib/rewardService';

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

    // Get available rewards for the teacher
    const rewards = await RewardService.getAvailableRewards(userId);
    const rewardHistory = await RewardService.getRewardHistory(userId);
    const totalRewardValue = await RewardService.calculateTotalRewardValue(userId);

    return NextResponse.json({
      success: true,
      data: {
        availableRewards: rewards,
        rewardHistory,
        totalRewardValue,
      },
    });

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

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
    const { rewardType, amount, paymentMethod, institution, certificateType } = body;

    let result;

    switch (rewardType) {
      case 'cash':
        if (!amount || !paymentMethod) {
          return NextResponse.json({ error: 'Amount and payment method required for cash redemption' }, { status: 400 });
        }
        result = await RewardService.redeemCashReward(userId, amount, paymentMethod);
        break;

      case 'academic-credits':
        if (!institution) {
          return NextResponse.json({ error: 'Institution required for academic credits' }, { status: 400 });
        }
        result = await RewardService.redeemAcademicCredits(userId, institution);
        break;

      case 'certificate':
        if (!certificateType) {
          return NextResponse.json({ error: 'Certificate type required' }, { status: 400 });
        }
        result = await RewardService.issueTeachingCertificate(userId, certificateType);
        break;

      default:
        return NextResponse.json({ error: 'Invalid reward type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error redeeming reward:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to redeem reward' },
      { status: 500 }
    );
  }
}

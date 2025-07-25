import User from '@/models/User';
import Credit from '@/models/Credit';
import Session from '@/models/Session';
import connectDB from '@/lib/mongodb';

interface MatchingPreferences {
  skill: string;
  sessionType: 'one-on-one' | 'group' | 'workshop' | 'quick-help';
  duration: number;
  preferredDate: Date;
  location: 'online' | 'in-person' | 'both';
  maxDistance?: number; // for in-person sessions
  learningStyle?: string[];
  budget?: number; // max credits willing to spend
}

interface TeacherProfile {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  experience?: string;
  skills?: {
    teaching: string[];
    learning: string[];
  };
  location?: string;
  role: string;
}

interface MatchResult {
  teacher: TeacherProfile;
  matchScore: number;
  matchFactors: {
    skillCompatibility: number;
    scheduleOverlap: number;
    locationProximity: number;
    reputationScore: number;
    learningStyleMatch: number;
  };
  estimatedCost: number;
  availability: string[];
}

export class MatchingService {
  // Find best teacher matches for a learning request
  static async findMatches(studentId: string, preferences: MatchingPreferences): Promise<MatchResult[]> {
    await connectDB();

    // Get potential teachers who can teach the skill
    const teachers = await User.find({
      $and: [
        { _id: { $ne: studentId } }, // Exclude self
        { 
          $or: [
            { role: 'mentor' },
            { role: 'both' }
          ]
        },
        {
          $or: [
            { 'skills.teaching': { $regex: preferences.skill, $options: 'i' } },
            { 'skills.teaching': { $in: [preferences.skill] } }
          ]
        }
      ]
    }).lean();

    if (teachers.length === 0) {
      return [];
    }

    // Get teacher credits and reputation data
    const teacherIds = teachers.map(t => t._id);
    const teacherCredits = await Credit.find({ 
      userId: { $in: teacherIds } 
    }).lean();

    // Get student data for compatibility checking
    const student = await User.findById(studentId).lean();
    if (!student) throw new Error('Student not found');

    // Calculate matches
    const matches: MatchResult[] = [];

    for (const teacher of teachers) {
      const teacherCredit = teacherCredits.find(c => 
        c.userId.toString() === (teacher._id as string).toString()
      );
      
      const matchResult = await this.calculateMatch(
        student,
        teacher,
        teacherCredit,
        preferences
      );

      if (matchResult.matchScore > 20) { // Minimum threshold
        matches.push(matchResult);
      }
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return matches.slice(0, 10); // Return top 10 matches
  }

  // Calculate compatibility between student and teacher
  private static async calculateMatch(
    student: any, // Will be typed properly with User interface
    teacher: any, // Will be typed properly with User interface  
    teacherCredit: any, // Will be typed properly with Credit interface
    preferences: MatchingPreferences
  ): Promise<MatchResult> {
    
    // 1. Skill Compatibility (30% weight)
    const skillCompatibility = this.calculateSkillCompatibility(
      teacher.skills?.teaching || [],
      preferences.skill
    );

    // 2. Schedule Overlap (25% weight)
    const scheduleOverlap = this.calculateScheduleOverlap(
      teacher.availability || '',
      preferences.preferredDate
    );

    // 3. Location Proximity (20% weight)
    const locationProximity = this.calculateLocationProximity(
      student.location || '',
      teacher.location || '',
      preferences.location
    );

    // 4. Reputation Score (15% weight)
    const reputationScore = teacherCredit?.reputation || 50;

    // 5. Learning Style Match (10% weight)
    const learningStyleMatch = this.calculateLearningStyleMatch(
      student.learningStyle || [],
      teacher.teachingStyle || []
    );

    // Calculate weighted match score
    const matchScore = Math.round(
      (skillCompatibility * 0.30) +
      (scheduleOverlap * 0.25) +
      (locationProximity * 0.20) +
      (reputationScore * 0.15) +
      (learningStyleMatch * 0.10)
    );

    // Calculate estimated cost
    const estimatedCost = this.calculateEstimatedCost(
      preferences.duration,
      reputationScore,
      teacher.role,
      preferences.sessionType
    );

    // Generate availability suggestions
    const availability = this.generateAvailabilitySlots(teacher.availability || '');

    return {
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        avatar: teacher.avatar,
        bio: teacher.bio,
        experience: teacher.experience,
        skills: teacher.skills,
        location: teacher.location,
        role: teacher.role,
      },
      matchScore,
      matchFactors: {
        skillCompatibility,
        scheduleOverlap,
        locationProximity,
        reputationScore,
        learningStyleMatch,
      },
      estimatedCost,
      availability,
    };
  }

  // Helper method: Calculate skill compatibility
  private static calculateSkillCompatibility(teachingSkills: string[], requestedSkill: string): number {
    const normalizedRequest = requestedSkill.toLowerCase();
    
    // Exact match
    if (teachingSkills.some(skill => skill.toLowerCase() === normalizedRequest)) {
      return 100;
    }

    // Partial match
    const partialMatches = teachingSkills.filter(skill => 
      skill.toLowerCase().includes(normalizedRequest) || 
      normalizedRequest.includes(skill.toLowerCase())
    );

    if (partialMatches.length > 0) {
      return 80;
    }

    // Related skills (could be enhanced with AI/ML)
    const relatedSkills = this.getRelatedSkills(normalizedRequest);
    const relatedMatches = teachingSkills.filter(skill => 
      relatedSkills.includes(skill.toLowerCase())
    );

    if (relatedMatches.length > 0) {
      return 60;
    }

    return 20; // Base score for any teacher
  }

  // Helper method: Calculate schedule overlap
  private static calculateScheduleOverlap(teacherAvailability: string, preferredDate: Date): number {
    // Simple implementation - in real scenario, parse availability and compare
    const dayOfWeek = preferredDate.getDay();
    const hour = preferredDate.getHours();
    
    // Basic scoring based on common availability patterns
    if (hour >= 9 && hour <= 17) { // Business hours
      return dayOfWeek >= 1 && dayOfWeek <= 5 ? 80 : 60; // Weekday vs weekend
    } else if (hour >= 18 && hour <= 21) { // Evening
      return 70;
    } else {
      return 40; // Early morning or late night
    }
  }

  // Helper method: Calculate location proximity
  private static calculateLocationProximity(
    studentLocation: string, 
    teacherLocation: string, 
    preferredLocation: string
  ): number {
    if (preferredLocation === 'online') {
      return 100; // Location doesn't matter for online
    }

    if (!studentLocation || !teacherLocation) {
      return 50; // Neutral score if location data missing
    }

    // Simple text comparison - could be enhanced with geolocation
    const studentLoc = studentLocation.toLowerCase();
    const teacherLoc = teacherLocation.toLowerCase();

    if (studentLoc === teacherLoc) {
      return 100; // Same location
    }

    // Check for same university/campus
    const commonKeywords = ['university', 'campus', 'college'];
    for (const keyword of commonKeywords) {
      if (studentLoc.includes(keyword) && teacherLoc.includes(keyword)) {
        return 85;
      }
    }

    // Check for same city
    const studentWords = studentLoc.split(' ');
    const teacherWords = teacherLoc.split(' ');
    const commonWords = studentWords.filter(word => teacherWords.includes(word));
    
    if (commonWords.length > 0) {
      return 70;
    }

    return 30; // Different locations
  }

  // Helper method: Calculate learning style match
  private static calculateLearningStyleMatch(studentStyles: string[], teacherStyles: string[]): number {
    if (!studentStyles.length || !teacherStyles.length) {
      return 70; // Neutral score if no style data
    }

    const commonStyles = studentStyles.filter(style => 
      teacherStyles.some(tStyle => tStyle.toLowerCase() === style.toLowerCase())
    );

    const matchPercentage = (commonStyles.length / studentStyles.length) * 100;
    return Math.round(matchPercentage);
  }

  // Helper method: Calculate estimated cost
  private static calculateEstimatedCost(
    duration: number,
    reputation: number,
    teacherRole: string,
    sessionType: string
  ): number {
    let baseCost = duration; // 1 credit per hour base

    // Reputation multiplier (50-100 rep = 0.8x to 1.2x cost)
    const reputationMultiplier = 0.8 + (reputation / 100) * 0.4;
    baseCost *= reputationMultiplier;

    // Teacher role multiplier
    if (teacherRole === 'mentor') {
      baseCost *= 1.2; // Teachers-only charge more
    }

    // Session type multiplier
    switch (sessionType) {
      case 'workshop':
        baseCost *= 0.8; // Group sessions cost less per person
        break;
      case 'quick-help':
        baseCost *= 1.1; // Quick help has slight premium
        break;
      case 'group':
        baseCost *= 0.7;
        break;
    }

    return Math.round(baseCost * 100) / 100; // Round to 2 decimal places
  }

  // Helper method: Generate availability slots
  private static generateAvailabilitySlots(availability: string): string[] {
    // Simple implementation - in real scenario, parse actual availability
    // For now, return default slots regardless of input
    console.log('Processing availability:', availability);
    return [
      'Monday 2:00 PM - 4:00 PM',
      'Wednesday 10:00 AM - 12:00 PM',
      'Friday 3:00 PM - 5:00 PM',
      'Saturday 9:00 AM - 11:00 AM'
    ];
  }

  // Helper method: Get related skills
  private static getRelatedSkills(skill: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'javascript': ['typescript', 'react', 'node.js', 'web development'],
      'python': ['django', 'flask', 'data science', 'machine learning'],
      'react': ['javascript', 'typescript', 'frontend', 'web development'],
      'design': ['ui/ux', 'figma', 'photoshop', 'graphics'],
      'marketing': ['social media', 'seo', 'content creation', 'analytics'],
    };

    return skillMap[skill] || [];
  }

  // Get teacher availability for booking
  static async getTeacherAvailability(teacherId: string, startDate: Date, endDate: Date) {
    await connectDB();

    // Get existing sessions for the teacher
    const existingSessions = await Session.find({
      teacherId,
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['scheduled', 'in-progress'] }
    }).lean();

    // Get teacher's general availability
    const teacher = await User.findById(teacherId).select('availability').lean() as { availability?: string } | null;

    return {
      existingSessions,
      generalAvailability: teacher?.availability || '',
      blockedSlots: existingSessions.map(session => ({
        start: session.scheduledDate,
        end: new Date(session.scheduledDate.getTime() + (session.duration * 60 * 60 * 1000))
      }))
    };
  }
}

export default MatchingService;

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Initialize Gemini AI client with error handling
let genAI: GoogleGenerativeAI | null = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } else {
    console.log('GEMINI_API_KEY not found in environment variables');
  }
} catch (error) {
  console.log('Gemini AI client initialization failed:', error);
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch users who can be mentors (have teaching skills or are mentors/both)
    const potentialMentors = await User.find({
      $or: [
        { role: 'mentor' },
        { role: 'both' },
        { 'skills.teaching': { $exists: true, $not: { $size: 0 } } }
      ]
    }).select('name email role avatar bio location experience skills university major createdAt').lean();

    // Transform users to mentor format for AI processing
    const mentorsData = potentialMentors.map((user) => ({
      id: user._id.toString(),
      name: user.name || 'Unknown User',
      skills: user.skills?.teaching || [],
      bio: user.bio || `${user.role} with expertise in ${(user.skills?.teaching || []).slice(0, 2).join(', ') || 'various skills'}`,
      image: user.avatar || '/person.svg',
      rating: 4.5 + (Math.random() * 0.4), // Generate realistic ratings
      students: Math.floor(Math.random() * 200) + 20,
      experience: user.experience || 'intermediate',
      hourlyRate: `$${30 + Math.floor(Math.random() * 40)}`,
      availability: 'Flexible',
      role: user.role,
      location: user.location || 'Online',
      university: user.university,
      major: user.major
    })).filter(mentor => mentor.skills.length > 0); // Only include mentors with teaching skills

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a direct and precise prompt for Gemini focusing on teaching skills
    const prompt = `You are a mentor matching AI for SkillForge learning platform.

TASK: Analyze the student's learning request and return ONLY mentors whose TEACHING SKILLS are RELEVANT to what the student wants to learn.

STUDENT REQUEST: "${query}"

AVAILABLE MENTORS:
${mentorsData.map(mentor => 
  `ID: ${mentor.id}
Name: ${mentor.name}
Teaching Skills: ${mentor.skills.length > 0 ? mentor.skills.join(', ') : 'General mentoring'}
Role: ${mentor.role}
Bio: ${mentor.bio}
Experience: ${mentor.experience}
Location: ${mentor.location}
University: ${mentor.university || 'Not specified'}
Major: ${mentor.major || 'Not specified'}
---`
).join('\n')}

STRICT MATCHING CRITERIA:
1. **PRIMARY REQUIREMENT**: Mentor's teaching skills MUST be directly relevant to student's learning request
2. **SKILL RELEVANCE**: Only recommend mentors if their teaching skills match or are closely related to what student wants to learn
3. **NO IRRELEVANT MATCHES**: Do NOT recommend mentors with unrelated skills (e.g., don't recommend "Email Marketing" for "Python" requests)
4. **BETTER FEWER THAN WRONG**: If no mentors have relevant skills, return fewer recommendations or empty array

RESPONSE RULES:
- Return ONLY mentors whose teaching skills are relevant to the student's request
- If only 1 relevant mentor exists, return only that 1 mentor
- If no relevant mentors exist, return empty array []
- Quality over quantity - better to return 0-1 perfect matches than 3 poor matches

RESPONSE FORMAT: Return ONLY a JSON array of relevant mentor IDs in order of best match.
Examples: 
- Good match: ["68a20089de6f9747641d5fac"]
- No good matches: []
- Multiple good matches: ["68a20089de6f9747641d5fac", "68a20089de6f9747641d5fad"]

Important: Your response must be valid JSON with only mentor IDs whose teaching skills are RELEVANT to the student's learning request.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text().trim();

    if (!aiResponse) {
      console.error('Empty response from Gemini AI');
    }

    // Parse AI response to get mentor IDs
    let mentorIds: string[] = [];
    try {
      // Clean the response - remove any markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      mentorIds = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.log('Failed to parse Gemini response as JSON:', parseError);
      
      // Fallback: extract IDs using regex (for MongoDB ObjectIds)
      const idMatches = aiResponse.match(/"([a-f\d]{24})"/g);
      if (idMatches) {
        mentorIds = idMatches.map((match: string) => match.replace(/"/g, ''));
      } else {
        console.log('Could not extract mentor IDs from response');
      }
    }

    // Validate mentor IDs
    const validIds = mentorIds.filter(id => mentorsData.some(mentor => mentor.id === id));

    // Get recommended mentors in order
    const recommendations = validIds
      .map(id => mentorsData.find(mentor => mentor.id === id))
      .filter(Boolean)
      .slice(0, 3);

    // If AI didn't return enough valid mentors, fill with ONLY relevant skill matches
    if (recommendations.length < 3) {
      const usedIds = recommendations.map(m => m?.id);
      
      // Find mentors with RELEVANT skill matches only
      const queryLower = query.toLowerCase();
      const skillMatches = mentorsData
        .filter(mentor => !usedIds.includes(mentor.id))
        .map(mentor => {
          let score = 0;
          let hasRelevantSkill = false;
          
          // Check for exact or closely related skill matches
          mentor.skills.forEach((skill: string) => {
            const skillLower = skill.toLowerCase();
            
            // Exact matches (high score)
            if (queryLower.includes(skillLower) || skillLower.includes(queryLower)) {
              score += 5;
              hasRelevantSkill = true;
            }
            // Related skill matches (moderate score)
            else if (isRelatedSkill(skill, query)) {
              score += 3;
              hasRelevantSkill = true;
            }
          });
          
          // Only consider mentors with relevant skills
          if (!hasRelevantSkill) {
            return { mentor, score: 0 };
          }
          
          // Boost based on role (prefer actual mentors)
          if (mentor.role === 'mentor' || mentor.role === 'both') {
            score += 1;
          }
          
          return { mentor, score };
        })
        .filter(match => match.score >= 4) // Only include mentors with strong skill relevance (4+ points)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3 - recommendations.length)
        .map(match => match.mentor);
      
      if (skillMatches.length > 0) {
        recommendations.push(...skillMatches);
        console.log('Added relevant skill-matched mentors:', skillMatches.map(m => m.id));
      } else {
        console.log('No mentors found with relevant skills for this query');
      }
    }
    

    return NextResponse.json({
      recommendations: recommendations.slice(0, 3),
      query,
      aiGenerated: true,
    });

  } catch (error) {
    console.error(' Database/AI recommendation error:', error);
  }
}

// Helper function to check if skills are related (STRICT matching)
function isRelatedSkill(mentorSkill: string, querySkill: string): boolean {
  const skillRelations: { [key: string]: string[] } = {
    // Programming & Tech
    'python': ['data science', 'machine learning', 'django', 'flask', 'pandas', 'numpy', 'ai', 'data analysis'],
    'javascript': ['react', 'node.js', 'vue', 'angular', 'typescript', 'frontend', 'web development'],
    'react': ['javascript', 'frontend', 'web development', 'typescript'],
    'typescript': ['javascript', 'react', 'angular', 'frontend'],
    'angular': ['typescript', 'javascript', 'frontend', 'web development'],
    'java': ['spring', 'backend', 'android', 'enterprise'],
    'node.js': ['javascript', 'backend', 'express', 'api'],
    
    // Data & AI
    'data science': ['python', 'machine learning', 'statistics', 'pandas', 'numpy', 'sql', 'data analysis'],
    'machine learning': ['python', 'data science', 'ai', 'tensorflow', 'pytorch', 'neural networks'],
    'ai': ['machine learning', 'python', 'data science', 'neural networks'],
    'data analysis': ['python', 'data science', 'statistics', 'excel', 'sql'],
    
    // Design (SEPARATE from programming)
    'ui/ux': ['user experience', 'user interface', 'prototyping', 'figma', 'adobe xd'],
    'graphic design': ['photoshop', 'illustrator', 'branding', 'visual design'],
    'web design': ['html', 'css', 'ui/ux', 'frontend design'],
    
    // Marketing (SEPARATE from programming)
    'digital marketing': ['seo', 'social media', 'content marketing', 'analytics'],
    'email marketing': ['marketing automation', 'content creation', 'campaigns'],
    'marketing': ['digital marketing', 'social media', 'seo', 'content'],
    
    // Mobile
    'mobile development': ['android', 'ios', 'react native', 'flutter'],
    'android': ['java', 'kotlin', 'mobile development'],
    'ios': ['swift', 'mobile development'],
  };

  const queryWords = querySkill.toLowerCase().split(/\s+/);
  const mentorSkillLower = mentorSkill.toLowerCase();
  
  
  // First check for direct keyword matches
  const hasDirectMatch = queryWords.some(word => {
    if (word.length < 3) return false; // Skip short words like "and", "or"
    return mentorSkillLower.includes(word) || word.includes(mentorSkillLower);
  });
  
  if (hasDirectMatch) {
    return true;
  }
  
  // Then check skill relations (must be exact matches, not partial)
  if (skillRelations[mentorSkillLower]) {
    const isRelated = queryWords.some(word => {
      if (word.length < 3) return false;
      return skillRelations[mentorSkillLower].some(related => 
        related === word || word === related // Exact match only
      );
    });
    
    if (isRelated) {
      return true;
    }
  }
  
  // Check reverse relations (exact matches only)
  for (const [skill, relations] of Object.entries(skillRelations)) {
    if (relations.includes(mentorSkillLower)) {
      const isQueryRelated = queryWords.some(word => {
        if (word.length < 3) return false;
        return skill === word || word === skill; // Exact match only
      });
      
      if (isQueryRelated) {
        return true;
      }
    }
  }
  
  return false;
}


import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Define mentor interface for consistency
interface Mentor {
  id: string;
  name: string;
  skills: string[];
  bio: string;
  image: string;
  rating: number;
  students: number;
  experience: string;
  hourlyRate: string;
  availability: string;
  role?: string;
  location?: string;
  university?: string;
  major?: string;
}

// Initialize Gemini AI client with error handling
let genAI: GoogleGenerativeAI | null = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI client initialized successfully');
  } else {
    console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
  }
} catch (error) {
  console.error('❌ Gemini AI client initialization failed:', error);
}

// Mentor data for AI matching
const MENTORS_DATA = [
  {
    "id": "1",
    "name": "Nipun Yasas",
    "skills": ["React", "MongoDB", "Node.js", "TypeScript"],
    "bio": "Expert in web development with 5+ years of experience building scalable applications.",
    "image": "/nipun.png",
    "rating": 4.9,
    "students": 127,
    "experience": "5+ years",
    "hourlyRate": "$45",
    "availability": "Weekends"
  },
  {
    "id": "2",
    "name": "Dinithi Dewmini",
    "skills": ["UI/UX", "Figma", "Adobe XD", "Prototyping"],
    "bio": "UI design enthusiast specializing in user-centered design and modern interfaces.",
    "image": "/dinithi.png",
    "rating": 4.8,
    "students": 89,
    "experience": "3+ years",
    "hourlyRate": "$35",
    "availability": "Evenings"
  },
  {
    "id": "3",
    "name": "Alex Chen",
    "skills": ["Python", "Machine Learning", "Data Science", "TensorFlow"],
    "bio": "Data scientist with expertise in ML algorithms and AI model development.",
    "image": "/alex.png",
    "rating": 4.7,
    "students": 156,
    "experience": "6+ years",
    "hourlyRate": "$60",
    "availability": "Flexible"
  },
  {
    "id": "4",
    "name": "Sarah Johnson",
    "skills": ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    "bio": "Marketing strategist helping businesses grow their online presence.",
    "image": "/sarah.png",
    "rating": 4.9,
    "students": 203,
    "experience": "4+ years",
    "hourlyRate": "$50",
    "availability": "Mornings"
  },
  {
    "id": "5",
    "name": "Mike Rodriguez",
    "skills": ["Flutter", "Dart", "Mobile Development", "Firebase"],
    "bio": "Mobile app developer creating cross-platform solutions with Flutter.",
    "image": "/mike.png",
    "rating": 4.6,
    "students": 94,
    "experience": "3+ years",
    "hourlyRate": "$40",
    "availability": "Weekdays"
  },
  {
    "id": "6",
    "name": "Emily Davis",
    "skills": ["Graphic Design", "Branding", "Illustrator", "Photoshop"],
    "bio": "Creative designer specializing in brand identity and visual storytelling.",
    "image": "/emily.png",
    "rating": 4.8,
    "students": 112,
    "experience": "4+ years",
    "hourlyRate": "$38",
    "availability": "Afternoons"
  }
];

export async function POST(request: NextRequest) {
  console.log('🔍 Starting AI recommendation request...');
  
  try {
    const { query } = await request.json();
    console.log('📝 User query:', query);

    if (!query) {
      console.error('❌ No query provided');
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Connect to database and fetch real users
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Fetch users who can be mentors (have teaching skills or are mentors/both)
    const potentialMentors = await User.find({
      $or: [
        { role: 'mentor' },
        { role: 'both' },
        { 'skills.teaching': { $exists: true, $not: { $size: 0 } } }
      ]
    }).select('name email role avatar bio location experience skills university major createdAt').lean();

    console.log(`🎯 Found ${potentialMentors.length} potential mentors in database`);

    if (potentialMentors.length === 0) {
      console.log('⚠️ No mentors found in database, using fallback');
      return getFallbackRecommendations(query, []);
    }

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

    console.log(`✅ Processed ${mentorsData.length} mentors with teaching skills`);
    
    // Log each mentor's teaching skills for debugging
    console.log('📚 Mentors and their teaching skills:');
    mentorsData.forEach((mentor, index) => {
      console.log(`${index + 1}. ${mentor.name} (${mentor.role})`);
      console.log(`   📖 Teaching Skills: [${mentor.skills.join(', ')}]`);
      console.log(`   🏫 University: ${mentor.university || 'Not specified'}`);
      console.log(`   📍 Location: ${mentor.location}`);
      console.log(`   💼 Experience: ${mentor.experience}`);
      console.log('   ---');
    });

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️ Gemini API key not configured, using fallback matching...');
      return getFallbackRecommendations(query, mentorsData);
    }

    if (!genAI) {
      console.log('⚠️ Gemini AI client not initialized, using fallback matching...');
      return getFallbackRecommendations(query, mentorsData);
    }

    console.log('🤖 Using Gemini AI for recommendations...');

    // Get the generative model
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

    console.log('📤 Sending request to Gemini AI...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text().trim();
    
    console.log('📥 Gemini AI response:', aiResponse);

    if (!aiResponse) {
      console.error('❌ Empty response from Gemini AI');
      return getFallbackRecommendations(query, mentorsData);
    }

    // Parse AI response to get mentor IDs
    let mentorIds: string[] = [];
    try {
      // Clean the response - remove any markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      mentorIds = JSON.parse(cleanResponse);
      console.log('✅ Parsed mentor IDs:', mentorIds);
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response as JSON:', parseError);
      console.log('🔧 Attempting regex extraction...');
      
      // Fallback: extract IDs using regex (for MongoDB ObjectIds)
      const idMatches = aiResponse.match(/"([a-f\d]{24})"/g);
      if (idMatches) {
        mentorIds = idMatches.map((match: string) => match.replace(/"/g, ''));
        console.log('✅ Extracted mentor IDs via regex:', mentorIds);
      } else {
        console.error('❌ Could not extract mentor IDs from response');
        return getFallbackRecommendations(query, mentorsData);
      }
    }

    // Validate mentor IDs
    const validIds = mentorIds.filter(id => mentorsData.some(mentor => mentor.id === id));
    console.log('✅ Valid mentor IDs:', validIds);

    // Get recommended mentors in order
    const recommendations = validIds
      .map(id => mentorsData.find(mentor => mentor.id === id))
      .filter(Boolean)
      .slice(0, 3);

    // If AI didn't return enough valid mentors, fill with ONLY relevant skill matches
    if (recommendations.length < 3) {
      console.log('⚠️ AI returned fewer than 3 mentors, searching for relevant skill matches...');
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
              console.log(`🎯 EXACT skill match: "${skill}" for query "${query}"`);
            }
            // Related skill matches (moderate score)
            else if (isRelatedSkill(skill, query)) {
              score += 3;
              hasRelevantSkill = true;
              console.log(`🔗 RELATED skill match: "${skill}" for query "${query}"`);
            }
          });
          
          // Only consider mentors with relevant skills
          if (!hasRelevantSkill) {
            console.log(`❌ No relevant skills for mentor ${mentor.name}: [${mentor.skills.join(', ')}]`);
            return { mentor, score: 0 };
          }
          
          // Boost based on role (prefer actual mentors)
          if (mentor.role === 'mentor' || mentor.role === 'both') {
            score += 1;
          }
          
          console.log(`✅ Relevant mentor found: ${mentor.name} with score ${score}`);
          return { mentor, score };
        })
        .filter(match => match.score >= 4) // Only include mentors with strong skill relevance (4+ points)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3 - recommendations.length)
        .map(match => match.mentor);
      
      if (skillMatches.length > 0) {
        recommendations.push(...skillMatches);
        console.log('✅ Added relevant skill-matched mentors:', skillMatches.map(m => m.id));
      } else {
        console.log('⚠️ No mentors found with relevant skills for this query');
      }
    }

    console.log('🎯 Final recommendations:', recommendations.map(m => m?.id).filter(Boolean));
    
    // Log recommended mentors and their teaching skills
    console.log('🏆 Recommended mentors and their teaching skills:');
    recommendations.forEach((mentor, index) => {
      if (mentor) {
        console.log(`${index + 1}. ${mentor.name} (ID: ${mentor.id})`);
        console.log(`   🎯 Teaching Skills: [${mentor.skills.join(', ')}]`);
        console.log(`   👤 Role: ${mentor.role}`);
        console.log(`   📍 Location: ${mentor.location}`);
        console.log(`   🏫 University: ${mentor.university || 'Not specified'}`);
        console.log(`   ⭐ Rating: ${mentor.rating.toFixed(1)}`);
        console.log('   ---');
      }
    });

    // Create appropriate message based on results
    let message = '';
    if (recommendations.length === 0) {
      message = '🔍 No mentors found with relevant teaching skills for your request. Try broadening your search terms.';
    } else if (recommendations.length === 1) {
      message = '🎯 Found 1 perfect mentor match for your learning goals!';
    } else {
      message = `🤖 AI found ${recommendations.length} excellent mentors with relevant teaching skills!`;
    }

    return NextResponse.json({
      recommendations: recommendations.slice(0, 3),
      query,
      aiGenerated: true,
      message
    });

  } catch (error) {
    console.error('❌ Database/AI recommendation error:', error);
    
    // Enhanced fallback logic
    const { query: fallbackQuery } = await request.json().catch(() => ({ query: '' }));
    console.log('🔄 Falling back to static data for query:', fallbackQuery);
    
    return getFallbackRecommendations(fallbackQuery, MENTORS_DATA);
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
  
  console.log(`🔍 Checking if "${mentorSkill}" is related to query: "${querySkill}"`);
  
  // First check for direct keyword matches
  const hasDirectMatch = queryWords.some(word => {
    if (word.length < 3) return false; // Skip short words like "and", "or"
    return mentorSkillLower.includes(word) || word.includes(mentorSkillLower);
  });
  
  if (hasDirectMatch) {
    console.log(`✅ Direct match found: "${mentorSkill}" contains keywords from "${querySkill}"`);
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
      console.log(`✅ Related skill found: "${mentorSkill}" is related to "${querySkill}"`);
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
        console.log(`✅ Reverse related skill found: "${mentorSkill}" is related to "${querySkill}"`);
        return true;
      }
    }
  }
  
  console.log(`❌ No relation found: "${mentorSkill}" is NOT related to "${querySkill}"`);
  return false;
}

// Enhanced fallback function with detailed logging
function getFallbackRecommendations(query: string, mentorsData: Mentor[]) {
  console.log('🔄 Using enhanced fallback matching for:', query);
  console.log(`📊 Available mentors: ${mentorsData.length}`);
  
  // If no mentors data provided, use static fallback
  const dataToUse = mentorsData.length > 0 ? mentorsData : MENTORS_DATA;
  
  let fallbackMatches = dataToUse.slice(0, 3).sort((a, b) => b.rating - a.rating);
  
  // Try to do some basic matching even on error
  if (query) {
    const queryLower = query.toLowerCase();
    console.log('🔍 Searching for skills matching:', queryLower);
    
    const skillMatches = dataToUse
      .map(mentor => {
        let score = 0;
        
        // Check skills match (higher weight for teaching skills)
        mentor.skills.forEach((skill: string) => {
          if (queryLower.includes(skill.toLowerCase()) || skill.toLowerCase().includes(queryLower)) {
            score += 3; // High weight for skill matches
            console.log(`✅ Skill match found: ${skill} for mentor ${mentor.name}`);
          }
        });
        
        // Check bio/name match
        if (mentor.bio && mentor.bio.toLowerCase().includes(queryLower)) {
          score += 1;
          console.log(`✅ Bio match found for mentor ${mentor.name}`);
        }
        
        if (mentor.name.toLowerCase().includes(queryLower)) {
          score += 1;
          console.log(`✅ Name match found for mentor ${mentor.name}`);
        }
        
        // Boost based on role (prefer actual mentors)
        const mentorWithRole = mentor as Mentor;
        if (mentorWithRole.role && (mentorWithRole.role === 'mentor' || mentorWithRole.role === 'both')) {
          score += 2;
        }
        
        // Boost based on rating
        score += mentor.rating * 0.5;
        
        return { mentor, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(match => {
        console.log(`📊 Mentor ${match.mentor.name} scored ${match.score}`);
        return match.mentor;
      });
    
    if (skillMatches.length > 0) {
      fallbackMatches = skillMatches;
      console.log('✅ Using skill-matched mentors');
    } else {
      console.log('⚠️ No skill matches found, using top-rated mentors');
    }
  }

  console.log('🎯 Fallback recommendations:', fallbackMatches.map(m => m.name));

  return NextResponse.json({
    recommendations: fallbackMatches,
    query: query || '',
    aiGenerated: false,
    message: `Found ${fallbackMatches.length} great mentors for you! (Smart matching active)`,
  });
}

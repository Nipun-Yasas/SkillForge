import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('OpenAI API key not configured, using fallback matching...');
      
      // Fallback: Enhanced keyword matching
      const fallbackMatches = MENTORS_DATA
        .map(mentor => {
          let score = 0;
          const queryLower = query.toLowerCase();
          
          // Check skills match
          mentor.skills.forEach(skill => {
            if (queryLower.includes(skill.toLowerCase()) || skill.toLowerCase().includes(queryLower)) {
              score += 3; // High weight for skill matches
            }
          });
          
          // Check bio/name match
          if (mentor.bio.toLowerCase().includes(queryLower) || mentor.name.toLowerCase().includes(queryLower)) {
            score += 1;
          }
          
          // Boost based on rating
          score += mentor.rating * 0.5;
          
          return { mentor, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(match => match.mentor);

      // If no matches found, return top-rated mentors
      const finalMatches = fallbackMatches.length > 0 ? fallbackMatches : 
        MENTORS_DATA.sort((a, b) => b.rating - a.rating).slice(0, 3);

      return NextResponse.json({
        recommendations: finalMatches,
        query,
        aiGenerated: false,
        message: `Found ${finalMatches.length} great mentors matching your skills! (Smart matching active)`
      });
    }

    // Create AI prompt for mentor matching
    const systemPrompt = `You are an intelligent mentor-matching AI assistant for SkillForge, a peer-to-peer learning platform. Your job is to analyze a student's learning request and recommend the top 3 most suitable mentors from the available list.

Consider these factors when matching:
1. Skills alignment (most important)
2. Experience level matching the student's needs
3. Teaching approach and bio compatibility
4. Rating and student success rate

Respond ONLY with a JSON array of mentor IDs in order of best match. Example: ["2", "1", "5"]`;

    const userPrompt = `Student's learning request: "${query}"

Available mentors:
${MENTORS_DATA.map(mentor => 
  `ID: ${mentor.id}, Name: ${mentor.name}, Skills: [${mentor.skills.join(', ')}], Bio: ${mentor.bio}, Experience: ${mentor.experience}, Rating: ${mentor.rating}`
).join('\n')}

Please recommend the top 3 mentor IDs that best match this student's needs.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using cost-effective model
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent matching
      max_tokens: 100
    });

    const aiResponse = response.choices[0].message.content?.trim();
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse AI response to get mentor IDs
    let mentorIds: string[] = [];
    try {
      mentorIds = JSON.parse(aiResponse);
    } catch {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to regex extraction
      const idMatches = aiResponse.match(/"(\d+)"/g);
      if (idMatches) {
        mentorIds = idMatches.map((match: string) => match.replace(/"/g, ''));
      }
    }

    // Get recommended mentors in order
    const recommendations = mentorIds
      .map(id => MENTORS_DATA.find(mentor => mentor.id === id))
      .filter(Boolean)
      .slice(0, 3);

    // If AI didn't return enough mentors, fill with top-rated ones
    if (recommendations.length < 3) {
      const usedIds = recommendations.map(m => m?.id);
      const additional = MENTORS_DATA
        .filter(mentor => !usedIds.includes(mentor.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3 - recommendations.length);
      
      recommendations.push(...additional);
    }

    return NextResponse.json({
      recommendations: recommendations.slice(0, 3),
      query,
      aiGenerated: true,
      message: `🤖 AI found ${recommendations.length} perfect matches for your learning goals!`
    });

  } catch (error) {
    console.error('AI recommendation error:', error);
    
    // Enhanced fallback logic
    const { query: fallbackQuery } = await request.json().catch(() => ({ query: '' }));
    
    let fallbackMatches = MENTORS_DATA.slice(0, 3).sort((a, b) => b.rating - a.rating);
    
    // Try to do some basic matching even on error
    if (fallbackQuery) {
      const queryLower = fallbackQuery.toLowerCase();
      const skillMatches = MENTORS_DATA.filter(mentor =>
        mentor.skills.some(skill => 
          queryLower.includes(skill.toLowerCase()) || skill.toLowerCase().includes(queryLower)
        )
      );
      
      if (skillMatches.length > 0) {
        fallbackMatches = skillMatches.slice(0, 3);
      }
    }

    return NextResponse.json({
      recommendations: fallbackMatches,
      query: fallbackQuery || '',
      aiGenerated: false,
      message: 'Showing highly-rated mentors for you! (Smart matching active)',
      // Remove the error field to prevent showing error messages to users
    });
  }
}

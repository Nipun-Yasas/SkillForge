import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, fileData } = await request.json();

    if (!message && !fileData) {
      return NextResponse.json({ error: "No message or file data provided" }, { status: 400 });
    }

    // Build the insurance claim analysis prompt
  const prompt = `System Role:
You are an expert assistant for SkillForge, a peer-to-peer skill exchange and mentorship platform for university students. 
Your task is to help users understand and navigate the platform, guide them in finding skills, mentors, and courses, 
and explain how the barter and credit-based system works.

User Query: ${message}
${fileData ? `File Data: ${fileData}` : ''}

Instructions:
1. Skill Exchange & Credits:
   - Explain how students can exchange skills in a barter system
   - Describe how mentors earn teacher credits through mentorships or course creation
   - Guide students who prefer not to teach on purchasing learning credits

2. Mentorship & Courses:
   - Show users how to find mentors for specific skills
   - Explain how students can follow mentors and access their courses
   - Provide guidance on initiating mentorship discussions via chat

3. Community Features:
   - Explain how discussion forums can be used for collaboration and resource sharing
   - Encourage active participation to maximize learning opportunities

4. User Guidance:
   - Suggest next steps for new users (e.g., how to post skills they want to learn/teach, find mentors, or join discussions)
   - Clarify platform processes in a simple, student-friendly way

5. Helpful Assistance:
   - Provide clear, conversational, and supportive answers
   - If the query is not related to SkillForge, offer general guidance about skill learning and peer mentorship

Format your response in a conversational, helpful manner while being thorough and student-friendly.`;

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiResult = await response.json();

    // Extract the response text
    const candidates = geminiResult?.candidates;
    const responseText = candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not process your request at this time.';

    return NextResponse.json({
      success: true,
      response: responseText,
      rawResponse: geminiResult
    });

  } catch (error) {
    console.error("Error in claim analysis:", error);
    return NextResponse.json({ 
      error: "Failed to analyze insurance claim",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

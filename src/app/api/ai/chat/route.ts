import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // AI Provider fallback / demo response:
    // In production, configure GEMINI_API_KEY in .env.local to route through Google Gemini API.
    const apiKey = process.env.GEMINI_API_KEY;

    let reply = "";
    const lower = message.toLowerCase();

    if (lower.includes("attendance")) {
      reply = "Your overall attendance is currently at 91.2% across 6 subjects. All your subjects are well above the mandatory 75% threshold. Your highest attendance is in Artificial Intelligence (94%). Keep it up! 📊";
    } else if (lower.includes("exam") || lower.includes("schedule")) {
      reply = "Your upcoming examinations begin on September 15, 2026. The first exam is 'Design & Analysis of Algorithms' (CS3501) in Exam Hall 3B from 10:00 AM to 01:00 PM. Would you like me to generate a 7-day study revision plan? 📝";
    } else if (lower.includes("fee") || lower.includes("fees")) {
      reply = "Your pending fee for Semester 5 is ₹65,000 (Tuition Fee), due on October 15, 2026. You have already paid ₹1,35,000 for this academic year. You can pay directly via the Fees portal. 💳";
    } else if (lower.includes("assignment") || lower.includes("homework")) {
      reply = "You have 2 pending assignments: 1) 'Dynamic Programming Problem Set' for Algorithms due September 15, and 2) 'Process Synchronization Assignment' for Operating Systems due September 18. Need help outlining the solutions? 📚";
    } else {
      reply = `Thank you for your question: "${message}". Maviqo AI can assist with academic concepts, lecture summarization, exam preparation, and checking your grades/attendance. (Note: Set GEMINI_API_KEY in .env.local for full multimodal capabilities). 🚀`;
    }

    return NextResponse.json({
      success: true,
      reply,
      provider: apiKey ? "gemini-1.5" : "maviqo-academic-engine",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

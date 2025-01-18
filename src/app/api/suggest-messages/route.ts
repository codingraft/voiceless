import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { generateText } from "ai";

// export const runtime = "edge";

export async function POST() {
  try {
    const prompt =
      "Generate three open-ended, engaging, and universally appealing questions formatted as a single string, with each question separated by '||'. These questions are intended for an anonymous social messaging platform like Qooh.me, aimed at encouraging friendly and inclusive interaction among a diverse audience. Avoid personal, sensitive, or controversial topics. Focus on universal themes that spark curiosity and promote positivity. For example, the output format should look like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are thought-provoking, foster meaningful conversations, and suit a wide range of participants.";

    // Pass the API key explicitly
    const model = google("gemini-1.5-pro-latest");

    // Generate the AI response
    const response = await generateText({
      model,
      prompt,
    });

    // Extract the generated content
    const content = response.response?.messages?.[0]?.content || "No response generated.";
    // console.log("Generated content:", content);
    // Return as a JSON response
    return NextResponse.json({
      content,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Google Generative AI Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error occurred:", error);
      throw error;
    }
  }
}

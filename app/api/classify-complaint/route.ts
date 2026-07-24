import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function localHeuristicClassify(subject: string, description: string): "High" | "Medium" | "Low" {
  const text = `${subject} ${description}`.toLowerCase();

  // High Priority Keywords
  const highKeywords = [
    "toxic", "hazard", "chemical", "spill", "overflowing", "health",
    "kid", "child", "school", "immediate", "poison", "danger", "urgent",
    "backyard", "safety", "fire", "explode", "medical", "injury", "overflows"
  ];

  // Medium Priority Keywords
  const mediumKeywords = [
    "odor", "foul", "smell", "rotten", "block", "stink", "days", "overflow", "garbage", "trash"
  ];

  for (const kw of highKeywords) {
    if (text.includes(kw)) {
      return "High";
    }
  }

  for (const kw of mediumKeywords) {
    if (text.includes(kw)) {
      return "Medium";
    }
  }

  return "Low";
}

export async function POST(request: Request) {
  try {
    const { subject, description } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Using local heuristic classification.");
      const priority = localHeuristicClassify(subject || "", description || "");
      return NextResponse.json({ priority, note: "local heuristic fallback due to missing api key" });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are an AI priority classification system for "EcoCycle Lanka", a waste management platform.
Analyze the following citizen complaint and classify its priority into exactly one of three categories: "High", "Medium", or "Low".

Priority Guidelines:
- High Priority: Immediate health or environmental safety hazard, toxic waste overflows, chemical spills, endangerment of children or schools, fires, active hazardous conditions, or severe public safety threats.
- Medium Priority: Missed collection of standard organic/recyclable garbage for more than 3 days, strong foul odors causing significant neighborhood distress, minor road blockages by waste.
- Low Priority: General questions, minor inquiries, suggestions, feedback, normal collections missed for under 2 days, or other non-hazardous reports.

Subject: "${subject || "N/A"}"
Description: "${description || "N/A"}"

Output exactly one word from ["High", "Medium", "Low"]. Do not include punctuation, explanations, or any other characters.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      console.log("Gemini raw response:", responseText);

      let priority = "Low";
      if (responseText.includes("High")) {
        priority = "High";
      } else if (responseText.includes("Medium")) {
        priority = "Medium";
      } else if (responseText.includes("Low")) {
        priority = "Low";
      } else {
        const lower = responseText.toLowerCase();
        if (lower.includes("high") || lower.includes("toxic") || lower.includes("hazard") || lower.includes("danger") || lower.includes("immediate")) {
          priority = "High";
        } else if (lower.includes("medium") || lower.includes("odor") || lower.includes("stink")) {
          priority = "Medium";
        }
      }

      return NextResponse.json({ priority });
    } catch (apiError: any) {
      console.warn("Gemini API call failed or quota exceeded. Using local heuristic fallback. Error:", apiError.message || apiError);
      const priority = localHeuristicClassify(subject || "", description || "");
      return NextResponse.json({ priority, note: "local heuristic fallback due to api error" });
    }
  } catch (error: any) {
    console.error("Error in AI classification route:", error);
    return NextResponse.json({ priority: "Low", error: error.message || String(error) });
  }
}

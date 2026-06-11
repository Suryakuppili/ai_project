import { NextResponse } from "next/server";
import { logicService } from "@/lib/services/logicService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subRegion, initialSymptoms } = body;
    
    let answersToProcess: Record<string, string> = {};

    // Pass sub_region to Prolog
    if (subRegion) {
      answersToProcess['sub_region'] = subRegion;
    }

    // Bridge UI array to backend single string expectation
    if (initialSymptoms && Array.isArray(initialSymptoms) && initialSymptoms.length > 0) {
       answersToProcess['initial_symptom'] = initialSymptoms[0]; 
    }

    const result = logicService.getNextQuestion(answersToProcess);

    const mappedQuestion = result.question ? {
        id: result.question.key,
        text: result.question.text,
        type: result.question.type,
        options: result.question.options
    } : undefined;

    return NextResponse.json({ question: mappedQuestion });
  } catch (error) {
    console.error("Start API error:", error);
    return NextResponse.json({ error: "Failed to start assessment" }, { status: 500 });
  }
}

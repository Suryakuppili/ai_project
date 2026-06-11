import { NextResponse } from "next/server";
import { logicService } from "@/lib/services/logicService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subRegion, initialSymptoms, answers } = body;
    
    let answersToProcess = answers || {};

    // Pass sub_region to Prolog
    if (subRegion) {
      answersToProcess['sub_region'] = subRegion;
    }

    // Bridge UI array to backend single string expectation
    if (initialSymptoms && Array.isArray(initialSymptoms) && initialSymptoms.length > 0) {
       answersToProcess['initial_symptom'] = initialSymptoms[0]; 
    }

    const result = logicService.getNextQuestion(answersToProcess);

    // Support both User's requested API format AND the existing UI expectations
    return NextResponse.json({
      question: result.question,
      done: result.done,
      
      moveToResult: result.done,
      nextQuestion: result.question ? {
          id: result.question.key,
          text: result.question.text,
          type: result.question.type,
          options: result.question.options
      } : undefined
    });

  } catch (error) {
    console.error("Next Question API error:", error);
    return NextResponse.json({ error: "Failed to process next question" }, { status: 500 });
  }
}

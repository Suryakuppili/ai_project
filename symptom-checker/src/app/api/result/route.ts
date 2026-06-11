import { NextResponse } from "next/server";
import { logicService } from "@/lib/services/logicService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subRegion, initialSymptoms, answers } = body;
    
    let answersToProcess = answers || {};

    if (subRegion) {
      answersToProcess['sub_region'] = subRegion;
    }

    if (initialSymptoms && Array.isArray(initialSymptoms) && initialSymptoms.length > 0) {
       answersToProcess['initial_symptom'] = initialSymptoms[0]; 
    }

    const result = logicService.getResults(answersToProcess);

    return NextResponse.json({
      results: result.results,
      diseases: result.results.map((r: any) => ({
        name: r.disease,
        confidence: 100, // Matching disease
        description: "Condition identified based on your anatomical region and reported symptoms.",
        severity: "medium",
        recommendation: "Please consult a healthcare professional for a detailed evaluation."
      }))
    });

  } catch (error) {
    console.error("Result API error:", error);
    return NextResponse.json({ error: "Failed to compute results" }, { status: 500 });
  }
}

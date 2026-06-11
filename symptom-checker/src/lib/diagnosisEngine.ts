/**
 * Diagnosis Engine — Modular Symptom → Disease Logic
 *
 * This module is designed to be easily replaceable with a
 * Prolog rule engine later. All logic is self-contained and
 * exports clean interfaces.
 */

// ======================================
// TYPES
// ======================================

export interface Question {
  id: string;
  text: string;
  type: "yesno" | "multiple";
  options?: string[];
}

export interface Disease {
  name: string;
  confidence: number;
  description: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

export interface DiagnosisRequest {
  age: number;
  sex: "male" | "female";
  region: string;
  answers: Record<string, string>;
}

export interface DiagnosisResponse {
  done: boolean;
  nextQuestion?: Question;
  diseases?: Disease[];
}

// ======================================
// SYMPTOM QUESTION TREES PER REGION
// ======================================

interface QuestionNode {
  question: Question;
  next: Record<string, string | null>; // answer → next question id, null = done
}

const questionTrees: Record<string, Record<string, QuestionNode>> = {
  head: {
    q1: {
      question: {
        id: "q1",
        text: "Are you experiencing a headache?",
        type: "yesno",
      },
      next: { Yes: "q2", No: "q3" },
    },
    q2: {
      question: {
        id: "q2",
        text: "How would you describe the headache?",
        type: "multiple",
        options: [
          "Throbbing/pulsating",
          "Dull pressure",
          "Sharp/stabbing",
          "Behind the eyes",
        ],
      },
      next: {
        "Throbbing/pulsating": "q4",
        "Dull pressure": "q5",
        "Sharp/stabbing": "q5",
        "Behind the eyes": "q4",
      },
    },
    q3: {
      question: {
        id: "q3",
        text: "Are you experiencing dizziness or vertigo?",
        type: "yesno",
      },
      next: { Yes: "q6", No: "q7" },
    },
    q4: {
      question: {
        id: "q4",
        text: "Do you experience sensitivity to light or sound?",
        type: "yesno",
      },
      next: { Yes: null, No: "q5" },
    },
    q5: {
      question: {
        id: "q5",
        text: "Do you have a fever (temperature above 100.4°F / 38°C)?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q6: {
      question: {
        id: "q6",
        text: "Do you experience blurred or double vision?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q7: {
      question: {
        id: "q7",
        text: "Are you having trouble concentrating or experiencing brain fog?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
  },

  chest: {
    q1: {
      question: {
        id: "q1",
        text: "Are you experiencing chest pain or discomfort?",
        type: "yesno",
      },
      next: { Yes: "q2", No: "q3" },
    },
    q2: {
      question: {
        id: "q2",
        text: "How would you describe the chest pain?",
        type: "multiple",
        options: [
          "Sharp/stabbing",
          "Tight/squeezing",
          "Burning sensation",
          "Dull ache",
        ],
      },
      next: {
        "Sharp/stabbing": "q4",
        "Tight/squeezing": "q4",
        "Burning sensation": "q5",
        "Dull ache": "q4",
      },
    },
    q3: {
      question: {
        id: "q3",
        text: "Are you experiencing shortness of breath?",
        type: "yesno",
      },
      next: { Yes: "q6", No: "q7" },
    },
    q4: {
      question: {
        id: "q4",
        text: "Does the pain worsen with deep breathing or coughing?",
        type: "yesno",
      },
      next: { Yes: "q5", No: null },
    },
    q5: {
      question: {
        id: "q5",
        text: "Do you have a persistent cough?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q6: {
      question: {
        id: "q6",
        text: "Do you experience wheezing or difficulty exhaling?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q7: {
      question: {
        id: "q7",
        text: "Do you feel an irregular or rapid heartbeat?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
  },

  abdomen: {
    q1: {
      question: {
        id: "q1",
        text: "Are you experiencing stomach pain or cramps?",
        type: "yesno",
      },
      next: { Yes: "q2", No: "q3" },
    },
    q2: {
      question: {
        id: "q2",
        text: "Where is the pain located?",
        type: "multiple",
        options: [
          "Upper abdomen",
          "Lower abdomen",
          "Around the navel",
          "Right side",
        ],
      },
      next: {
        "Upper abdomen": "q4",
        "Lower abdomen": "q4",
        "Around the navel": "q5",
        "Right side": "q5",
      },
    },
    q3: {
      question: {
        id: "q3",
        text: "Are you experiencing nausea or vomiting?",
        type: "yesno",
      },
      next: { Yes: "q6", No: "q7" },
    },
    q4: {
      question: {
        id: "q4",
        text: "Do you have diarrhea or constipation?",
        type: "multiple",
        options: ["Diarrhea", "Constipation", "Both/alternating", "Neither"],
      },
      next: {
        Diarrhea: "q5",
        Constipation: null,
        "Both/alternating": null,
        Neither: null,
      },
    },
    q5: {
      question: {
        id: "q5",
        text: "Do you have a fever?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q6: {
      question: {
        id: "q6",
        text: "Have you noticed any bloating or gas?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q7: {
      question: {
        id: "q7",
        text: "Have you experienced loss of appetite recently?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
  },

  limbs: {
    q1: {
      question: {
        id: "q1",
        text: "Where are you experiencing the issue?",
        type: "multiple",
        options: ["Arms/hands", "Legs/feet", "Joints", "All over"],
      },
      next: {
        "Arms/hands": "q2",
        "Legs/feet": "q2",
        Joints: "q3",
        "All over": "q4",
      },
    },
    q2: {
      question: {
        id: "q2",
        text: "Are you experiencing pain, numbness, or weakness?",
        type: "multiple",
        options: ["Pain", "Numbness/tingling", "Weakness", "Swelling"],
      },
      next: {
        Pain: "q5",
        "Numbness/tingling": "q5",
        Weakness: null,
        Swelling: "q6",
      },
    },
    q3: {
      question: {
        id: "q3",
        text: "Are the joints swollen, stiff, or both?",
        type: "multiple",
        options: ["Swollen", "Stiff", "Both", "Neither — just pain"],
      },
      next: {
        Swollen: "q6",
        Stiff: null,
        Both: null,
        "Neither — just pain": "q5",
      },
    },
    q4: {
      question: {
        id: "q4",
        text: "Do you have muscle aches or body pain?",
        type: "yesno",
      },
      next: { Yes: "q5", No: null },
    },
    q5: {
      question: {
        id: "q5",
        text: "Did this start after an injury or physical activity?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
    q6: {
      question: {
        id: "q6",
        text: "Is the affected area red or warm to the touch?",
        type: "yesno",
      },
      next: { Yes: null, No: null },
    },
  },
};

// ======================================
// DISEASE MAPPING RULES
// ======================================

interface DiseaseRule {
  name: string;
  region: string;
  description: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
  conditions: (answers: Record<string, string>, age: number, sex: string) => number;
}

const diseaseRules: DiseaseRule[] = [
  // HEAD
  {
    name: "Migraine",
    region: "head",
    description:
      "A neurological condition causing intense, throbbing headaches, often accompanied by nausea, sensitivity to light and sound.",
    severity: "medium",
    recommendation: "Rest in a dark, quiet room. Consider over-the-counter pain relievers. See a neurologist if migraines are frequent.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 30;
      if (a.q2 === "Throbbing/pulsating" || a.q2 === "Behind the eyes") score += 30;
      if (a.q4 === "Yes") score += 25;
      if (a.q5 === "No") score += 10;
      return Math.min(score, 95);
    },
  },
  {
    name: "Tension Headache",
    region: "head",
    description:
      "The most common type of headache, causing mild to moderate pain that feels like a tight band around the head.",
    severity: "low",
    recommendation: "Over-the-counter pain relief, stress management, regular sleep schedule, and staying hydrated.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 25;
      if (a.q2 === "Dull pressure") score += 35;
      if (a.q4 === "No") score += 15;
      if (a.q5 === "No") score += 10;
      return Math.min(score, 90);
    },
  },
  {
    name: "Sinusitis",
    region: "head",
    description:
      "Inflammation of the sinuses, often caused by infection, leading to facial pressure, nasal congestion, and headache.",
    severity: "low",
    recommendation: "Nasal decongestants, warm compresses, steam inhalation. See a doctor if symptoms persist beyond 10 days.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 20;
      if (a.q2 === "Behind the eyes" || a.q2 === "Dull pressure") score += 20;
      if (a.q5 === "Yes") score += 30;
      return Math.min(score, 85);
    },
  },
  {
    name: "Vertigo / Inner Ear Disorder",
    region: "head",
    description:
      "A sensation of spinning or dizziness, often caused by inner ear problems (BPPV, labyrinthitis, or Meniere's disease).",
    severity: "medium",
    recommendation: "Avoid sudden head movements. See an ENT specialist for proper diagnosis and vestibular rehabilitation.",
    conditions: (a) => {
      let score = 0;
      if (a.q3 === "Yes") score += 40;
      if (a.q6 === "Yes") score += 30;
      if (a.q1 === "No") score += 10;
      return Math.min(score, 90);
    },
  },

  // CHEST
  {
    name: "Asthma",
    region: "chest",
    description:
      "A chronic condition where airways narrow, swell, and produce extra mucus, making breathing difficult.",
    severity: "medium",
    recommendation: "Use prescribed inhalers. Avoid triggers. Seek emergency care if symptoms are severe.",
    conditions: (a) => {
      let score = 0;
      if (a.q3 === "Yes") score += 30;
      if (a.q6 === "Yes") score += 35;
      if (a.q5 === "Yes") score += 15;
      return Math.min(score, 90);
    },
  },
  {
    name: "Acid Reflux (GERD)",
    region: "chest",
    description:
      "Stomach acid flows back into the esophagus, causing burning chest pain (heartburn) and discomfort.",
    severity: "low",
    recommendation: "Avoid spicy/fatty foods, eat smaller meals, don't lie down after eating. Consider antacids.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 20;
      if (a.q2 === "Burning sensation") score += 40;
      if (a.q4 === "No") score += 10;
      return Math.min(score, 85);
    },
  },
  {
    name: "Costochondritis",
    region: "chest",
    description:
      "Inflammation of the cartilage connecting ribs to the breastbone, causing sharp chest pain that mimics heart-related pain.",
    severity: "low",
    recommendation: "Anti-inflammatory medications, rest, and stretching. Usually resolves on its own.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 20;
      if (a.q2 === "Sharp/stabbing") score += 30;
      if (a.q4 === "Yes") score += 25;
      return Math.min(score, 85);
    },
  },
  {
    name: "Bronchitis",
    region: "chest",
    description:
      "Inflammation of the bronchial tubes, often following a cold, causing persistent cough with mucus.",
    severity: "medium",
    recommendation: "Rest, fluids, humidifier use. See a doctor if cough persists over 3 weeks or if you have high fever.",
    conditions: (a) => {
      let score = 0;
      if (a.q5 === "Yes") score += 35;
      if (a.q3 === "Yes") score += 20;
      if (a.q4 === "Yes") score += 15;
      return Math.min(score, 85);
    },
  },

  // ABDOMEN
  {
    name: "Gastroenteritis (Stomach Flu)",
    region: "abdomen",
    description:
      "An intestinal infection causing diarrhea, cramps, nausea, vomiting, and sometimes fever.",
    severity: "medium",
    recommendation: "Stay hydrated with clear fluids. Rest. Seek medical attention if symptoms are severe or last more than a few days.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 20;
      if (a.q3 === "Yes") score += 25;
      if (a.q4 === "Diarrhea") score += 25;
      if (a.q5 === "Yes") score += 15;
      return Math.min(score, 90);
    },
  },
  {
    name: "Irritable Bowel Syndrome (IBS)",
    region: "abdomen",
    description:
      "A chronic condition affecting the large intestine, causing cramping, bloating, gas, diarrhea, and constipation.",
    severity: "low",
    recommendation: "Dietary changes (low-FODMAP), stress management, regular exercise. Consult a gastroenterologist.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 20;
      if (a.q4 === "Both/alternating") score += 35;
      if (a.q6 === "Yes") score += 25;
      if (a.q5 === "No") score += 10;
      return Math.min(score, 85);
    },
  },
  {
    name: "Appendicitis",
    region: "abdomen",
    description:
      "Inflammation of the appendix causing severe pain in the lower right abdomen. Requires prompt medical attention.",
    severity: "high",
    recommendation: "⚠️ Seek immediate medical attention. Appendicitis often requires surgical treatment.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 15;
      if (a.q2 === "Right side") score += 35;
      if (a.q5 === "Yes") score += 20;
      if (a.q3 === "Yes") score += 10;
      return Math.min(score, 90);
    },
  },
  {
    name: "Acid Reflux / Gastritis",
    region: "abdomen",
    description:
      "Inflammation of the stomach lining or acid flowing back from the stomach, causing upper abdominal pain and discomfort.",
    severity: "low",
    recommendation: "Avoid acidic/spicy foods, alcohol. Eat smaller meals. Consider antacids or proton pump inhibitors.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Yes") score += 20;
      if (a.q2 === "Upper abdomen") score += 30;
      if (a.q3 === "Yes") score += 15;
      if (a.q6 === "Yes") score += 10;
      return Math.min(score, 85);
    },
  },

  // LIMBS
  {
    name: "Arthritis",
    region: "limbs",
    description:
      "Inflammation of one or more joints, causing pain, swelling, and stiffness that typically worsens with age.",
    severity: "medium",
    recommendation: "Anti-inflammatory medications, physical therapy, joint protection. See a rheumatologist for proper management.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Joints") score += 30;
      if (a.q3 === "Both" || a.q3 === "Swollen") score += 30;
      if (a.q6 === "Yes") score += 20;
      if (a.q5 === "No") score += 10;
      return Math.min(score, 90);
    },
  },
  {
    name: "Carpal Tunnel Syndrome",
    region: "limbs",
    description:
      "Compression of the median nerve in the wrist, causing numbness, tingling, and weakness in the hand.",
    severity: "low",
    recommendation: "Wrist splints, ergonomic adjustments, rest from repetitive activities. Consider seeing an orthopedist.",
    conditions: (a) => {
      let score = 0;
      if (a.q1 === "Arms/hands") score += 25;
      if (a.q2 === "Numbness/tingling") score += 35;
      if (a.q5 === "No") score += 15;
      return Math.min(score, 85);
    },
  },
  {
    name: "Muscle Strain",
    region: "limbs",
    description:
      "Overstretching or tearing of muscle fibers, often due to overuse, fatigue, or improper use of a muscle.",
    severity: "low",
    recommendation: "Rest, ice, compression, elevation (RICE). Over-the-counter pain relief. Gradually return to activity.",
    conditions: (a) => {
      let score = 0;
      if (a.q2 === "Pain") score += 20;
      if (a.q5 === "Yes") score += 40;
      if (a.q4 === "Yes") score += 15;
      return Math.min(score, 85);
    },
  },
  {
    name: "Peripheral Neuropathy",
    region: "limbs",
    description:
      "Damage to peripheral nerves causing weakness, numbness, and pain, usually in the hands and feet.",
    severity: "medium",
    recommendation: "Manage underlying conditions (diabetes, etc.). Pain management medications. See a neurologist.",
    conditions: (a, age) => {
      let score = 0;
      if (a.q2 === "Numbness/tingling") score += 30;
      if (a.q1 === "All over" || a.q1 === "Legs/feet") score += 20;
      if (a.q5 === "No") score += 10;
      if (age > 50) score += 15;
      return Math.min(score, 85);
    },
  },
];

// ======================================
// ENGINE FUNCTIONS
// ======================================

/**
 * Get the next question based on current answers
 */
export function getNextQuestion(
  region: string,
  answers: Record<string, string>
): Question | null {
  const tree = questionTrees[region];
  if (!tree) return null;

  // If no answers yet, return first question
  const answerKeys = Object.keys(answers);
  if (answerKeys.length === 0) {
    return tree.q1?.question || null;
  }

  // Find the last answered question and determine next
  const lastAnsweredId = answerKeys[answerKeys.length - 1];
  const lastAnswer = answers[lastAnsweredId];
  const node = tree[lastAnsweredId];

  if (!node) return null;

  const nextId = node.next[lastAnswer];
  if (!nextId) return null; // null means done

  const nextNode = tree[nextId];
  return nextNode?.question || null;
}

/**
 * Compute diagnosis from all collected answers
 */
export function getDiagnosis(request: DiagnosisRequest): Disease[] {
  const { region, answers, age, sex } = request;

  const relevantRules = diseaseRules.filter((r) => r.region === region);
  const scored = relevantRules.map((rule) => ({
    name: rule.name,
    confidence: rule.conditions(answers, age, sex),
    description: rule.description,
    severity: rule.severity,
    recommendation: rule.recommendation,
  }));

  // Sort by confidence descending
  scored.sort((a, b) => b.confidence - a.confidence);

  // Return top 3-4 results with meaningful confidence
  return scored.filter((d) => d.confidence > 15).slice(0, 4);
}

/**
 * Main entry point: process a diagnosis step
 * Returns either the next question or final results
 */
export function processDiagnosisStep(
  request: DiagnosisRequest
): DiagnosisResponse {
  const nextQuestion = getNextQuestion(request.region, request.answers);

  if (nextQuestion) {
    return {
      done: false,
      nextQuestion,
    };
  }

  // No more questions — compute diagnosis
  const diseases = getDiagnosis(request);
  return {
    done: true,
    diseases,
  };
}

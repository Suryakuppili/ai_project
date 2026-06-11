export interface SubRegion {
  id: string;
  name: string;
  symptoms: string[];
}

export interface Region {
  id: string;
  name: string;
  subRegions: SubRegion[];
}

export const ANATOMY_DATA: Record<string, Region> = {
  Head: {
    id: "Head",
    name: "Head & Neck",
    subRegions: [
      {
        id: "Eyes",
        name: "Eyes",
        symptoms: ["Blurry vision", "Redness", "Itching", "Eye pain", "Discharge", "Light sensitivity", "Floaters", "Dryness", "Swelling around eyes", "Double vision"],
      },
      {
        id: "Ears",
        name: "Ears",
        symptoms: ["Ear pain", "Hearing loss", "Ringing (Tinnitus)", "Ear discharge", "Fullness feeling", "Itching", "Bleeding from ear", "Vertigo/Dizziness", "Popping sound", "Redness"],
      },
      {
        id: "NoseThroat",
        name: "Nose & Throat",
        symptoms: ["Runny nose", "Congestion", "Sore throat", "Difficulty swallowing", "Loss of smell", "Sneezing", "Nosebleeds", "Hoarseness", "Dry throat", "Post-nasal drip"],
      },
      {
        id: "Neurological",
        name: "General Head / Brain",
        symptoms: ["Throbbing headache", "Dull headache", "Sharp head pain", "Dizziness", "Confusion", "Memory loss", "Slurred speech", "Fainting", "Scalp tenderness", "Facial numbness"],
      },
    ],
  },
  Chest: {
    id: "Chest",
    name: "Chest",
    subRegions: [
      {
        id: "Respiratory",
        name: "Lungs & Breathing",
        symptoms: ["Shortness of breath", "Dry cough", "Wet cough", "Wheezing", "Pain when breathing", "Phlegm (clear)", "Phlegm (colored)", "Rapid breathing", "Chest tightness", "Coughing up blood"],
      },
      {
        id: "Cardiovascular",
        name: "Heart",
        symptoms: ["Heavy chest pressure", "Sharp chest pain", "Palpitations", "Rapid heartbeat", "Irregular heartbeat", "Pain radiating to arm", "Pain radiating to jaw", "Sweating with pain", "Fluttering feeling", "Dizziness with chest pain"],
      },
      {
        id: "Musculoskeletal",
        name: "Ribs & Muscles",
        symptoms: ["Tenderness to touch", "Pain when twisting", "Muscle spasms", "Bruising on chest", "Swelling over ribs", "Sharp pain when coughing", "Aching chest muscles", "Stiffness", "Visible lump", "Pain after lifting"],
      },
    ],
  },
  Abdomen: {
    id: "Abdomen",
    name: "Abdomen & Pelvis",
    subRegions: [
      {
        id: "UpperAbdomen",
        name: "Upper Abdomen / Stomach",
        symptoms: ["Stomach ache", "Nausea", "Vomiting", "Heartburn / Acid reflux", "Bloating", "Loss of appetite", "Feeling full quickly", "Upper right pain", "Upper left pain", "Burping"],
      },
      {
        id: "LowerAbdomen",
        name: "Lower Abdomen / Intestines",
        symptoms: ["Lower right pain", "Lower left pain", "Diarrhea", "Constipation", "Blood in stool", "Change in bowel habits", "Cramping", "Excessive gas", "Mucus in stool", "Black/tarry stool"],
      },
      {
        id: "Pelvic",
        name: "Pelvic Region & Urinary",
        symptoms: ["Frequent urination", "Painful urination", "Blood in urine", "Pelvic pain", "Groin pain", "Difficulty starting urination", "Cloudy urine", "Strong smelling urine", "Genital itching", "Unusual discharge"],
      },
    ],
  },
  Limbs: {
    id: "Limbs",
    name: "Arms & Legs",
    subRegions: [
      {
        id: "Joints",
        name: "Joints",
        symptoms: ["Joint pain", "Joint swelling", "Stiffness in morning", "Redness over joint", "Warmth over joint", "Decreased range of motion", "Clicking/Popping", "Joint locking", "Pain with movement", "Weakness in joint"],
      },
      {
        id: "Muscles",
        name: "Muscles & Tendons",
        symptoms: ["Muscle ache", "Muscle cramps", "Spasms", "Muscle weakness", "Tendon pain", "Pain after exercise", "Twitching", "Loss of muscle mass", "Tenderness", "Heavy feeling in limbs"],
      },
      {
        id: "Nerves",
        name: "Nerves & Circulation",
        symptoms: ["Numbness", "Tingling / Pins and needles", "Cold hands/feet", "Swelling in ankles/feet", "Blue/pale skin on extremities", "Burning sensation", "Shooting pain", "Loss of sensation", "Varicose veins", "Restless legs"],
      },
    ],
  },
  WholeBody: {
    id: "WholeBody",
    name: "Whole Body / General",
    subRegions: [
      {
        id: "Systemic",
        name: "General Feelings",
        symptoms: ["Fever", "Fatigue / Exhaustion", "Chills", "Night sweats", "Unexplained weight loss", "Weight gain", "Excessive thirst", "Sleep problems", "General weakness", "Feeling cold constantly"],
      },
      {
        id: "Skin",
        name: "Skin & Hair",
        symptoms: ["Skin rash", "Itching", "Hives", "Dry skin", "Changes in moles", "Yellowing of skin (Jaundice)", "Unusual bruising", "Hair loss", "Nail changes", "Blisters"],
      },
      {
        id: "Immune",
        name: "Immune & Lymphatic",
        symptoms: ["Swollen lymph nodes in neck", "Swollen lymph nodes in armpit", "Swollen lymph nodes in groin", "Frequent infections", "Slow healing wounds", "Easy bleeding", "Mouth ulcers", "Persistent low-grade fever", "Chronic fatigue", "Allergic reactions"],
      },
    ],
  },
};

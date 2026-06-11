"use client";

import { useState } from "react";
import Link from "next/link";
import StepIndicator from "../components/StepIndicator";
import QuestionFlow from "../components/QuestionFlow";
import ResultsView from "../components/ResultsView";
import styles from "./page.module.css";
import { ANATOMY_DATA, SubRegion } from "@/lib/data/anatomy";

const STEPS = ["Info", "Area", "Specifics", "Symptoms", "Assessment", "Results"];

interface Disease {
  name: string;
  confidence: number;
  description: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

export default function CheckerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [regionId, setRegionId] = useState<string | null>(null);
  const [subRegion, setSubRegion] = useState<SubRegion | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);

  // Derived state
  const regionData = regionId ? ANATOMY_DATA[regionId] : null;

  const handleInfoSubmit = () => {
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) return;
    setCurrentStep(1); 
  };

  const handleRegionSelect = (id: string) => {
    setRegionId(id);
    setCurrentStep(2);
  };

  const handleSubRegionSelect = (sub: SubRegion) => {
    setSubRegion(sub);
    setSelectedSymptoms([]);
    setCurrentStep(3);
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSymptomsSubmit = () => {
    if (selectedSymptoms.length === 0) return;
    setCurrentStep(4);
  };

  const handleQuestionsComplete = (results: Disease[]) => {
    setDiseases(results);
    setCurrentStep(5);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAge("");
    setSex("male");
    setRegionId(null);
    setSubRegion(null);
    setSelectedSymptoms([]);
    setDiseases([]);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>+</div>
            <span>SymptomAI</span>
          </Link>
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>
      </nav>

      <div className={styles.content}>
        {/* ===== STEP 0: Basic Info ===== */}
        {currentStep === 0 && (
          <div className={styles.stepContainer} key="step0">
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step 1 of 6</div>
              <h1 className={styles.stepTitle}>Basic Information</h1>
              <p className={styles.stepSubtitle}>
                Tell us a bit about yourself to start the assessment.
              </p>
            </div>

            <div className={styles.formCard}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className={styles.formInput}
                  min={1}
                  max={120}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Biological Sex</label>
                <div className={styles.sexToggle}>
                  <button
                    className={`${styles.sexOption} ${sex === "male" ? styles.sexActive : ""}`}
                    onClick={() => setSex("male")}
                  >
                    Male
                  </button>
                  <button
                    className={`${styles.sexOption} ${sex === "female" ? styles.sexActive : ""}`}
                    onClick={() => setSex("female")}
                  >
                    Female
                  </button>
                </div>
              </div>

              <button
                className={styles.nextBtn}
                onClick={handleInfoSubmit}
                disabled={!age || parseInt(age) < 1}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 1: Region Selection ===== */}
        {currentStep === 1 && (
          <div className={styles.stepContainer} key="step1">
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step 2 of 6</div>
              <h1 className={styles.stepTitle}>Affected Area</h1>
              <p className={styles.stepSubtitle}>
                Where are you feeling the most discomfort?
              </p>
            </div>

            <div className={styles.regionGrid}>
              {Object.values(ANATOMY_DATA).map((r) => (
                <button
                  key={r.id}
                  className={styles.regionCard}
                  onClick={() => handleRegionSelect(r.id)}
                >
                  <span className={styles.regionLabel}>{r.name}</span>
                </button>
              ))}
            </div>

            <button className={styles.backBtn} onClick={() => setCurrentStep(0)} style={{ marginTop: "2rem" }}>
              Back
            </button>
          </div>
        )}

        {/* ===== STEP 2: Sub-Region Selection ===== */}
        {currentStep === 2 && regionData && (
          <div className={styles.stepContainer} key="step2">
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step 3 of 6</div>
              <h1 className={styles.stepTitle}>Specific Area</h1>
              <p className={styles.stepSubtitle}>
                Which part of your {regionData.name.toLowerCase()} is affected?
              </p>
            </div>

            <div className={styles.regionGrid}>
              {regionData.subRegions.map((sub) => (
                <button
                  key={sub.id}
                  className={styles.regionCard}
                  onClick={() => handleSubRegionSelect(sub)}
                >
                  <span className={styles.regionLabel}>{sub.name}</span>
                </button>
              ))}
            </div>

            <button className={styles.backBtn} onClick={() => setCurrentStep(1)} style={{ marginTop: "2rem" }}>
              Back
            </button>
          </div>
        )}

        {/* ===== STEP 3: Multiple Symptoms Selection ===== */}
        {currentStep === 3 && subRegion && (
          <div className={styles.stepContainer} key="step3">
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step 4 of 6</div>
              <h1 className={styles.stepTitle}>Select Symptoms</h1>
              <p className={styles.stepSubtitle}>
                Check all the symptoms you are experiencing in your {subRegion.name.toLowerCase()}.
              </p>
            </div>

            <div className={styles.symptomGrid}>
              {subRegion.symptoms.map((symptom) => (
                <label key={symptom} className={`${styles.symptomCheckbox} ${selectedSymptoms.includes(symptom) ? styles.symptomActive : ""}`}>
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                    style={{ display: 'none' }}
                  />
                  <span>{symptom}</span>
                </label>
              ))}
            </div>

            <div className={styles.actionRow} style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "space-between" }}>
              <button className={styles.backBtn} onClick={() => setCurrentStep(2)}>
                Back
              </button>
              <button
                className={styles.nextBtn}
                style={{ width: "auto" }}
                onClick={handleSymptomsSubmit}
                disabled={selectedSymptoms.length === 0}
              >
                Start Interview
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: Question Flow ===== */}
        {currentStep === 4 && subRegion && (
          <div className={styles.stepContainer} key="step4">
            <div className={styles.stepHeader}>
              <div className={styles.stepBadge}>Step 5 of 6</div>
              <h1 className={styles.stepTitle}>Assessment Interview</h1>
              <p className={styles.stepSubtitle}>
                Please answer a few follow-up questions to help us understand your condition.
              </p>
            </div>

            <div className={styles.questionContainer}>
              <QuestionFlow
                region={regionId!}
                subRegion={subRegion.id}
                initialSymptoms={selectedSymptoms}
                age={parseInt(age) || 30}
                sex={sex}
                onComplete={handleQuestionsComplete}
              />
            </div>
          </div>
        )}

        {/* ===== STEP 5: Results ===== */}
        {currentStep === 5 && (
          <div className={styles.stepContainer} key="step5">
            <ResultsView diseases={diseases} onRestart={handleRestart} />
          </div>
        )}
      </div>
    </div>
  );
}

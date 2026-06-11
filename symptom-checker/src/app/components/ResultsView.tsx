"use client";

import styles from "./ResultsView.module.css";

interface Disease {
  name: string;
  confidence: number;
  description: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

interface ResultsViewProps {
  diseases: Disease[];
  onRestart: () => void;
}

export default function ResultsView({ diseases, onRestart }: ResultsViewProps) {
  const severityConfig = {
    low: { label: "Low", color: "#10b981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.2)" },
    medium: { label: "Moderate", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.2)" },
    high: { label: "High", color: "#ef4444", bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.2)" },
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>📊</div>
        <h2 className={styles.title}>Assessment Results</h2>
        <p className={styles.subtitle}>
          Based on your responses, here are the possible conditions:
        </p>
      </div>

      <div className={styles.diseaseList}>
        {diseases.map((disease, index) => {
          const sev = severityConfig[disease.severity];
          return (
            <div
              key={disease.name}
              className={styles.diseaseCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                  <h3 className={styles.diseaseName}>{disease.name}</h3>
                  <span
                    className={styles.severityBadge}
                    style={{
                      color: sev.color,
                      background: sev.bg,
                      borderColor: sev.border,
                    }}
                  >
                    {sev.label} Severity
                  </span>
                </div>

                <div className={styles.confidenceRow}>
                  <div className={styles.confidenceBar}>
                    <div
                      className={styles.confidenceFill}
                      style={{
                        width: `${disease.confidence}%`,
                        background: `linear-gradient(90deg, ${sev.color}, ${sev.color}88)`,
                        animationDelay: `${index * 0.1 + 0.3}s`,
                      }}
                    />
                  </div>
                  <span className={styles.confidenceValue}>
                    {disease.confidence}%
                  </span>
                </div>
              </div>

              <p className={styles.description}>{disease.description}</p>

              <div className={styles.recommendation}>
                <span className={styles.recLabel}>💡 Recommendation</span>
                <p className={styles.recText}>{disease.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <div className={styles.disclaimerIcon}>⚠️</div>
        <div>
          <strong>Medical Disclaimer</strong>
          <p>
            This is not a medical diagnosis. The results are based on a
            simplified symptom assessment and should not replace professional
            medical advice. Please consult a qualified healthcare provider for
            proper diagnosis and treatment.
          </p>
        </div>
      </div>

      <button className={styles.restartBtn} onClick={onRestart}>
        ← Start New Assessment
      </button>
    </div>
  );
}

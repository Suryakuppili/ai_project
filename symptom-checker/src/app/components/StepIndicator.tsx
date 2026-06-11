"use client";

import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div key={step} className={styles.stepWrapper}>
          <div
            className={`${styles.step} ${
              index < currentStep
                ? styles.completed
                : index === currentStep
                  ? styles.active
                  : styles.pending
            }`}
          >
            <div className={styles.stepDot}>
              {index < currentStep ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span className={styles.stepLabel}>{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`${styles.connector} ${
                index < currentStep ? styles.connectorActive : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.landing}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚕</div>
            <span>SymptomAI</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/checker" className="btn-ghost">
              Start Checker
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          AI-Powered Health Assessment
        </div>

        <h1 className={styles.heroTitle}>
          Understand Your{" "}
          <span className={styles.heroTitleGradient}>Symptoms</span>
          <br />
          In Minutes
        </h1>

        <p className={styles.heroSubtitle}>
          Interactive 3D body mapping with intelligent conversational
          assessment. Select your symptoms, answer guided questions, and receive
          possible diagnoses instantly.
        </p>

        <div className={styles.heroCTA}>
          <Link href="/checker" className={styles.ctaButton}>
            Check Your Symptoms
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🧬</div>
            <h3 className={styles.featureTitle}>3D Body Mapping</h3>
            <p className={styles.featureDesc}>
              Interactive 3D human model. Click on the affected body region to
              begin your assessment.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💬</div>
            <h3 className={styles.featureTitle}>Smart Questions</h3>
            <p className={styles.featureDesc}>
              Dynamic conversational flow that adapts based on your answers to
              narrow down conditions.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Detailed Results</h3>
            <p className={styles.featureDesc}>
              Receive possible diagnoses with confidence levels, explanations,
              and next-step recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        This tool is for informational purposes only and is not a substitute for
        professional medical advice.
      </footer>
    </div>
  );
}

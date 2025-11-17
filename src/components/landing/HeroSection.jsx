import { ArrowRight, PhoneCall } from 'lucide-react'
import styles from './LandingPage.module.css'

function HeroSection({ onCTAClick }) {
  return (
    <header className={`${styles.section} ${styles.hero}`} id="hero">
      <div className={`${styles.sectionInner} ${styles.heroGrid}`}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>Venue concierge for East Africa</div>
          <h1>Find the Perfect Venue for Your Next Event — Fast, Free & Hassle-Free.</h1>
          <p>
            Tell us what you&apos;re planning, and we’ll match you with vetted venues in Kampala,
            Nairobi, and beyond — within 24 hours.
          </p>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.primaryButton} onClick={onCTAClick}>
              Find My Venue
              <ArrowRight size={18} />
            </button>
            {/* <button type="button" className={styles.secondaryButton}>
                            Talk to an Expert
                            <PhoneCall size={18} />
                        </button> */}
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <strong>500+</strong>
              Curated venues
            </div>
            <div className={styles.stat}>
              <strong>24 hrs</strong>
              To get recommendations
            </div>
            <div className={styles.stat}>
              <strong>4.9/5</strong>
              Satisfaction score
            </div>
          </div>
        </div>
        <div className={styles.heroInsightCard}>
          <button type="button" className={styles.primaryButton} onClick={onCTAClick}>
            Click here to tell us what space you’re looking for ↓
          </button>
          <ul>
            <li>✨ Rooftop for 80 guests — Kampala CBD</li>
            <li>🤝 Corporate offsite — Entebbe Lakefront</li>
            <li>💍 Garden wedding — Lugogo</li>
          </ul>
          <p>
            Share your brief and we&apos;ll shortlist venues that fit your style, capacity, budget,
            and preferred dates.
          </p>
        </div>
      </div>
    </header>
  )
}

export default HeroSection

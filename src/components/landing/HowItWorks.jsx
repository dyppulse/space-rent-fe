import { CalendarDays, CheckCircle2, ClipboardList } from 'lucide-react'
import styles from './LandingPage.module.css'

const steps = [
  {
    icon: <ClipboardList size={24} />,
    title: 'Tell Us About Your Event',
    description:
      'Share event type, date, guests, budget, and preferred locations in under two minutes.',
  },
  {
    icon: <CalendarDays size={24} />,
    title: 'We Match You with Top Venues',
    description:
      'Receive a shortlist of vetted venues — complete with pricing and availability — within 24 hours.',
  },
  {
    icon: <CheckCircle2 size={24} />,
    title: 'Visit & Book with Confidence',
    description:
      'We coordinate tours, negotiate rates, and guide you from first visit to confirmed booking.',
  },
]

function HowItWorks({ onCTAClick }) {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>How Space Hire works</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2>From idea to confirmed venue — in three simple steps</h2>
          <button type="button" className={styles.primaryButton} onClick={onCTAClick}>
            Start My Venue Search
          </button>
        </div>
        <div className={styles.cardGrid} style={{ marginTop: '2rem' }}>
          {steps.map((step) => (
            <article key={step.title} className={styles.card}>
              <div className={styles.cardIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks

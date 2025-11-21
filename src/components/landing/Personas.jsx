import styles from './LandingPage.module.css'

const personas = [
  {
    title: 'Corporate teams',
    description:
      'Strategy retreats, product launches, customer summits, and trainings that need turnkey logistics.',
  },
  {
    title: 'Couples planning weddings',
    description:
      'Garden ceremonies, ballroom receptions, and multi-day celebrations with accommodation support.',
  },
  {
    title: 'Event planners',
    description:
      'Trusted partners who need fresh venues, negotiated rates, and on-call venue support.',
  },
  {
    title: 'Celebration hosts',
    description: 'Milestone birthdays, baby showers, proposals, and private dining experiences.',
  },
]

function Personas({ onCTAClick }) {
  return (
    <section className={styles.section} id="personas">
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>Who it&apos;s for</div>
        <h2>Built for teams, couples, planners, and unforgettable celebrations</h2>
        <div className={styles.personasGrid} style={{ marginTop: '2rem' }}>
          {personas.map((persona) => (
            <article key={persona.title} className={styles.personaCard}>
              <h3>{persona.title}</h3>
              <p>{persona.description}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          className={`${styles.primaryButton}`}
          style={{ marginTop: '2rem' }}
          onClick={onCTAClick}
        >
          Get Venue Suggestions
        </button>
      </div>
    </section>
  )
}

export default Personas

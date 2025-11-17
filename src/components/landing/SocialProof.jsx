import styles from './LandingPage.module.css'

function SocialProof() {
  return (
    <section className={styles.section} id="social-proof">
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>Trusted partners</div>
        <h2>Trusted by event planners in Kampala & Nairobi.</h2>
        <p>
          Hundreds of planners, brand teams, and couples rely on Space Hire to surface new venues
          and negotiate the best value.
        </p>

        <div className={styles.logoRow}>
          {['VenueCo', 'Skyline Events', 'Nairobi Hub', 'Lugogo Gardens'].map((logo) => (
            <div key={logo} className={styles.logoPlaceholder}>
              {logo}
            </div>
          ))}
        </div>

        <div className={styles.testimonialCard}>
          <p>
            “Space Hire sent us five perfect venue options for a 400-person summit within a day —
            site visits, negotiation, and contracts were all handled seamlessly.”
          </p>
          <strong>— Brenda N., Corporate Events Lead</strong>
        </div>
      </div>
    </section>
  )
}

export default SocialProof

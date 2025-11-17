import styles from './LandingPage.module.css'

function FooterSection() {
  return (
    <footer className={`${styles.section} ${styles.footer}`} id="about">
      <div className={styles.footerInner}>
        <div>
          <div className={styles.eyebrow}>About Space Hire</div>
          <p>
            Mission: We&apos;re making event planning simpler by connecting people to Uganda’s best
            venues — with transparent pricing, concierge support, and local expertise.
          </p>
        </div>
        <div>
          <p>
            Email:{' '}
            <a
              href="mailto:hello@spacehire.africa"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              hello@spacehire.africa
            </a>
          </p>
          <p>
            Have a venue to list?{' '}
            <a
              href="mailto:partners@spacehire.africa"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              Submit your venue
            </a>
          </p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#hero">Back to top</a>
          <a href="#lead-form">Find My Venue</a>
          <a href="#how-it-works">How it works</a>
          <a href="#personas">Who it&apos;s for</a>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection

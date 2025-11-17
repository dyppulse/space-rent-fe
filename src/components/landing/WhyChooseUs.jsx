import { Handshake, MapPin, Sparkles, Users } from 'lucide-react'
import styles from './LandingPage.module.css'

const benefits = [
  {
    icon: <Sparkles size={22} />,
    title: 'Personalized Recommendations',
    description: 'Curated lists that match your style, guest count, and experience goals.',
  },
  {
    icon: <MapPin size={22} />,
    title: 'Local Knowledge',
    description:
      'We maintain on-the-ground intel for venues in Kampala, Entebbe, Nairobi, and Mombasa.',
  },
  {
    icon: <Handshake size={22} />,
    title: 'Hands-On Booking Assistance',
    description: 'Negotiation support, walkthrough coordination, and contract guidance.',
  },
  {
    icon: <Users size={22} />,
    title: 'Free for Users',
    description:
      'We earn from venue partners, so you get concierge-level service at no extra cost.',
  },
]

function WhyChooseUs() {
  return (
    <section className={styles.section} id="why-us">
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>Why choose Space Hire</div>
        <h2>Your venue partner from first brief to confirmed booking</h2>
        <div className={styles.cardGrid} style={{ marginTop: '2rem' }}>
          {benefits.map((benefit) => (
            <article key={benefit.title} className={styles.card}>
              <div className={styles.cardIcon}>{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs

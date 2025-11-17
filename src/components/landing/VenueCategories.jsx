import { ArrowUpRight } from 'lucide-react'
import styles from './LandingPage.module.css'

const categoryData = [
  { name: 'Outdoor Gardens', image: '/images/outdoor-party-space.jpg' },
  { name: 'Rooftops', image: '/images/outdoor-party-space-5.jpg' },
  { name: 'Conference Venues', image: '/images/conference-center.jpg' },
  { name: 'Wedding Halls', image: '/images/outdoor-party-space-3.jpg' },
  { name: 'Boutique Cafés', image: '/images/outdoor-party-space-2.jpg' },
  { name: 'Lakefront Retreats', image: '/images/outdoor-party-space-4.jpg' },
]

function VenueCategories({ onCTAClick }) {
  return (
    <section className={styles.section} id="categories">
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>Popular venue categories</div>
        <h2>Spaces for weddings, product launches, retreats, and celebrations</h2>
        <div className={styles.categoriesGrid} style={{ marginTop: '2rem' }}>
          {categoryData.map((category) => (
            <article key={category.name} className={styles.categoryCard}>
              <img
                src={category.image}
                alt={category.name}
                className={styles.categoryImage}
                loading="lazy"
                onError={(e) => (e.currentTarget.style.background = '#cbd5f5')}
              />
              <div className={styles.categoryContent}>
                <h3>{category.name}</h3>
                <p>Browse similar venues and get matched with available spaces in minutes.</p>
                <button type="button" className={styles.categoryButton} onClick={onCTAClick}>
                  Find One Like This
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VenueCategories

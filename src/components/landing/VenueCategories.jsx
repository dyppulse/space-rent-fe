import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Pagination, Box } from '@mui/material'
import { useSpaces } from '../../api/queries/spaceQueries'
import styles from './LandingPage.module.css'

// const categoryData = [
//   { name: 'Outdoor Gardens', image: '/images/outdoor-party-space.jpg' },
//   { name: 'Rooftops', image: '/images/outdoor-party-space-5.jpg' },
//   { name: 'Conference Venues', image: '/images/conference-center.jpg' },
//   { name: 'Wedding Halls', image: '/images/outdoor-party-space-3.jpg' },
//   { name: 'Boutique Cafés', image: '/images/outdoor-party-space-2.jpg' },
//   { name: 'Lakefront Retreats', image: '/images/outdoor-party-space-4.jpg' },
// ]

function VenueCategories() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const spacesPerPage = 6

  const { data, isLoading, error, isFetching } = useSpaces({
    limit: spacesPerPage,
    page: page,
  })

  // Debug logging
  console.log('VenueCategories - Query state:', {
    isLoading,
    isFetching,
    hasData: !!data,
    error,
    page,
  })

  // Get active spaces from current page
  const spaces = data?.spaces?.filter((space) => space.isActive) || []

  // Calculate total pages
  const totalSpaces = data?.totalSpaces || 0
  const totalPages = Math.ceil(totalSpaces / spacesPerPage)

  const handlePageChange = (event, value) => {
    setPage(value)
    // Scroll to top of section when page changes
    const section = document.getElementById('categories')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSpaceClick = (spaceId) => {
    navigate(`/spaces/${spaceId}`)
  }

  const getSpaceImage = (space) => {
    if (space.images && space.images.length > 0) {
      return space.images[0].url || space.images[0]
    }
    return '/placeholder.jpg'
  }

  const getSpaceDescription = (space) => {
    if (space.description) {
      return space.description.length > 100
        ? `${space.description.substring(0, 100)}...`
        : space.description
    }
    return 'Browse similar venues and get matched with available spaces in minutes.'
  }

  if (isLoading) {
    return (
      <section className={styles.section} id="categories">
        <div className={styles.sectionInner}>
          <div className={styles.eyebrow}>Popular venue categories</div>
          <h2>Spaces for weddings, product launches, retreats, and celebrations</h2>
          <div className={styles.categoriesGrid} style={{ marginTop: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className={styles.categoryCard} style={{ opacity: 0.5 }}>
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    background: '#cbd5f5',
                    borderRadius: '8px',
                  }}
                />
                <div className={styles.categoryContent}>
                  <h3>Loading...</h3>
                  <p>Loading space information...</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (spaces.length === 0) {
    return (
      <section className={styles.section} id="categories">
        <div className={styles.sectionInner}>
          <div className={styles.eyebrow}>Popular venue categories</div>
          <h2>Spaces for weddings, product launches, retreats, and celebrations</h2>
          <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
            No spaces available at the moment. Check back soon!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section} id="categories">
      <div className={styles.sectionInner}>
        <div className={styles.eyebrow}>Popular venue categories</div>
        <h2>Spaces for weddings, product launches, retreats, and celebrations</h2>
        <div className={styles.categoriesGrid} style={{ marginTop: '2rem' }}>
          {spaces.map((space) => (
            <article key={space.id} className={styles.categoryCard}>
              <img
                src={getSpaceImage(space)}
                alt={space.name}
                className={styles.categoryImage}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                  e.currentTarget.style.background = '#cbd5f5'
                }}
              />
              <div className={styles.categoryContent}>
                <h3>{space.name}</h3>
                <p>{getSpaceDescription(space)}</p>
                <button
                  type="button"
                  className={styles.categoryButton}
                  onClick={() => handleSpaceClick(space.id)}
                >
                  View Space
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4,
              mb: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </div>
    </section>
  )
}

export default VenueCategories

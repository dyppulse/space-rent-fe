import { useCallback, useRef, useState } from 'react'
import FooterSection from '../components/landing/FooterSection'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'
import LandingStyles from '../components/landing/LandingPage.module.css'
import LeadForm from '../components/landing/LeadForm'
import Personas from '../components/landing/Personas'
import SpacePreviewModal from '../components/landing/SpacePreviewModal'
import VenueCategories from '../components/landing/VenueCategories'
import WhyChooseUs from '../components/landing/WhyChooseUs'

function LandingPage() {
  const formRef = useRef(null)
  const [leadSpace, setLeadSpace] = useState(null)
  const [spacePreview, setSpacePreview] = useState({
    open: false,
    spaceId: null,
    initialSpace: null,
  })

  const handleScrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleOpenSpacePreview = useCallback((space) => {
    setSpacePreview({
      open: true,
      spaceId: space?.id ?? null,
      initialSpace: space || null,
    })
  }, [])

  const handleCloseSpacePreview = useCallback(() => {
    setSpacePreview({ open: false, spaceId: null, initialSpace: null })
  }, [])

  const handleRequestSpace = useCallback(
    (space) => {
      if (!space) return
      setLeadSpace({ id: space.id, name: space.name })
      setSpacePreview({ open: false, spaceId: null, initialSpace: null })
      handleScrollToForm()
    },
    [handleScrollToForm]
  )

  const handleClearSelectedSpace = useCallback(() => {
    setLeadSpace(null)
  }, [])

  return (
    <div className={LandingStyles.page}>
      <HeroSection onCTAClick={handleScrollToForm} />
      <HowItWorks onCTAClick={handleScrollToForm} />
      <WhyChooseUs />
      <VenueCategories onSpaceSelect={handleOpenSpacePreview} />
      <Personas onCTAClick={handleScrollToForm} />
      <LeadForm
        formRef={formRef}
        selectedSpace={leadSpace}
        onClearSelectedSpace={handleClearSelectedSpace}
      />
      <FooterSection />
      <SpacePreviewModal
        open={spacePreview.open}
        spaceId={spacePreview.spaceId}
        initialSpace={spacePreview.initialSpace}
        onClose={handleCloseSpacePreview}
        onRequestSpace={handleRequestSpace}
      />
    </div>
  )
}

export default LandingPage

import { useCallback, useRef } from 'react'
import FooterSection from '../components/landing/FooterSection'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'
import LandingStyles from '../components/landing/LandingPage.module.css'
import LeadForm from '../components/landing/LeadForm'
import Personas from '../components/landing/Personas'
import VenueCategories from '../components/landing/VenueCategories'
import WhyChooseUs from '../components/landing/WhyChooseUs'

function LandingPage() {
  const formRef = useRef(null)

  const handleScrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className={LandingStyles.page}>
      <HeroSection onCTAClick={handleScrollToForm} />
      <HowItWorks onCTAClick={handleScrollToForm} />
      <WhyChooseUs />
      <VenueCategories onCTAClick={handleScrollToForm} />
      <Personas onCTAClick={handleScrollToForm} />
      <LeadForm formRef={formRef} />
      <FooterSection />
    </div>
  )
}

export default LandingPage

import { useMemo, useState } from 'react'
import styles from './LandingPage.module.css'

const steps = ['Contact', 'Event Details', 'Preferences']

const initialFormState = {
  name: '',
  contact: '',
  eventType: '',
  eventDate: '',
  city: '',
  guestCount: '',
  budgetRange: '',
  notes: '',
}

const eventTypes = [
  'Corporate Workshop',
  'Wedding',
  'Product Launch',
  'Birthday / Celebration',
  'Conference',
  'Other',
]
const budgetRanges = [
  '<$1,000',
  '$1,000 - $3,000',
  '$3,000 - $7,500',
  '$7,500 - $15,000',
  '>$15,000',
]

function LeadForm({ formRef }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validateStep = () => {
    const nextErrors = {}
    if (currentStep === 0) {
      if (!formData.name) nextErrors.name = 'Name is required'
      if (!formData.contact) nextErrors.contact = 'Email or phone is required'
    }
    if (currentStep === 1) {
      if (!formData.eventType) nextErrors.eventType = 'Select an event type'
      if (!formData.eventDate) nextErrors.eventDate = 'Event date is required'
      if (!formData.city) nextErrors.city = 'City or location is required'
      if (!formData.guestCount) nextErrors.guestCount = 'Provide an approximate guest count'
    }
    if (currentStep === 2) {
      if (!formData.budgetRange) nextErrors.budgetRange = 'Select a budget range'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateStep()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setErrors({})
    setCurrentStep(0)
    setIsSuccess(false)
  }

  const stepDescription = useMemo(() => {
    if (currentStep === 0) return 'How can we reach you?'
    if (currentStep === 1) return 'Tell us about your event'
    return 'Budget & special requests'
  }, [currentStep])

  return (
    <section className={styles.section} id="lead-form" ref={formRef}>
      <div className={styles.sectionInner}>
        <div className={styles.formSection}>
          <div className={styles.eyebrow}>Priority intake</div>
          <h2>Tell us about your event and we’ll send curated venues within 24 hours</h2>
          <p>{stepDescription}</p>

          <div className={styles.formCard}>
            <div className={styles.steps}>
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={`${styles.step} ${index === currentStep ? styles.stepActive : ''}`}
                >
                  <span>{index + 1}</span>
                  {label}
                </div>
              ))}
            </div>

            {isSuccess ? (
              <div className={styles.successCard}>
                <h3>Thank you! 🎉</h3>
                <p>Our venue expert will reach out within 24 hours with your top venue options.</p>
                <button
                  type="button"
                  className={styles.primaryButton}
                  style={{ marginTop: '1.5rem' }}
                  onClick={resetForm}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {currentStep === 0 && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name*</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Brenda Namuli"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact">Email or Phone*</label>
                      <input
                        id="contact"
                        name="contact"
                        type="text"
                        placeholder="you@example.com / +256..."
                        value={formData.contact}
                        onChange={handleChange}
                      />
                      {errors.contact && <span className={styles.error}>{errors.contact}</span>}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor="eventType">Event Type*</label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                        >
                          <option value="">Select an option</option>
                          {eventTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.eventType && (
                          <span className={styles.error}>{errors.eventType}</span>
                        )}
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="eventDate">Event Date*</label>
                        <input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={handleChange}
                        />
                        {errors.eventDate && (
                          <span className={styles.error}>{errors.eventDate}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor="city">City / Location*</label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Kampala, Entebbe, Nairobi..."
                          value={formData.city}
                          onChange={handleChange}
                        />
                        {errors.city && <span className={styles.error}>{errors.city}</span>}
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="guestCount">Guest Count*</label>
                        <input
                          id="guestCount"
                          name="guestCount"
                          type="number"
                          min="1"
                          placeholder="Approx. number of guests"
                          value={formData.guestCount}
                          onChange={handleChange}
                        />
                        {errors.guestCount && (
                          <span className={styles.error}>{errors.guestCount}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor="budgetRange">Budget Range*</label>
                        <select
                          id="budgetRange"
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleChange}
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((range) => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                        {errors.budgetRange && (
                          <span className={styles.error}>{errors.budgetRange}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="notes">Special Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        placeholder="Must-have amenities, preferred style, parking needs..."
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {currentStep > 0 && (
                      <button type="button" className={styles.secondaryButton} onClick={handlePrev}>
                        Back
                      </button>
                    )}
                    {currentStep < steps.length - 1 && (
                      <button type="button" className={styles.primaryButton} onClick={handleNext}>
                        Next
                      </button>
                    )}
                  </div>
                  {currentStep === steps.length - 1 && (
                    <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Find My Venue Now'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadForm

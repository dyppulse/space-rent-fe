import { useEffect, useState } from 'react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { leadService } from '../../api/services/leadService'
import styles from './LandingPage.module.css'

const steps = ['Contact', 'Event Details', 'Preferences']

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  city: '',
  guestCount: '',
  budgetRange: '',
  notes: '',
}

const eventTypes = ['Wedding', 'Birthday celebration', 'Graduation party']
const UG_E164_LENGTH = 13
const budgetRanges = [
  '<$1,000',
  '$1,000 - $3,000',
  '$3,000 - $7,500',
  '$7,500 - $15,000',
  '>$15,000',
]

function LeadForm({ formRef, selectedSpace: selectedSpaceProp = null, onClearSelectedSpace }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [selectedSpace, setSelectedSpace] = useState(selectedSpaceProp)

  useEffect(() => {
    if (selectedSpaceProp) {
      setSelectedSpace(selectedSpaceProp)
      return
    }

    if (selectedSpaceProp === null) {
      setSelectedSpace(null)
    }
  }, [selectedSpaceProp])

  useEffect(() => {
    if (selectedSpaceProp) return
    try {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('spaceId')
      const name = params.get('spaceName')
      if (id) {
        setSelectedSpace({
          id,
          name: name || 'Selected space',
        })
      }
    } catch (error) {
      console.error('Error parsing space selection from URL', error)
    }
  }, [selectedSpaceProp])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validateEmail = (email) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(email)
  }

  const validateStep = () => {
    const nextErrors = {}
    if (currentStep === 0) {
      if (!formData.name) nextErrors.name = 'Name is required'
      if (!formData.email) nextErrors.email = 'Email is required'
      else if (!validateEmail(formData.email))
        nextErrors.email = 'Please enter a valid email address'
      if (!formData.phone) nextErrors.phone = 'Phone number is required'
      else if (!isValidPhoneNumber(formData.phone)) nextErrors.phone = 'Enter a valid phone number'
      else if (formData.phone.startsWith('+256') && formData.phone.length !== UG_E164_LENGTH)
        nextErrors.phone = 'Uganda numbers should be 9 digits after +256'
    }
    if (currentStep === 1) {
      if (!formData.eventType) nextErrors.eventType = 'Select an event type'
      if (!formData.eventDate) nextErrors.eventDate = 'Event date is required'
      if (!formData.city) nextErrors.city = 'City or location is required'
      if (!formData.guestCount) nextErrors.guestCount = 'Provide an approximate guest count'
      else if (parseInt(formData.guestCount, 10) < 1)
        nextErrors.guestCount = 'Guest count must be at least 1'
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
    setSubmitError(null)

    try {
      await leadService.submitLead({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        city: formData.city.trim(),
        guestCount: parseInt(formData.guestCount, 10),
        budgetRange: formData.budgetRange,
        notes: formData.notes?.trim() || '',
        spaceId: selectedSpace?.id || null,
      })

      setIsSuccess(true)
      setSubmitError(null)
    } catch (error) {
      console.error('Error submitting lead:', error)
      const errorMessage =
        error?.response?.data?.message || 'Failed to submit form. Please try again.'
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setErrors({})
    setCurrentStep(0)
    setIsSuccess(false)
    setSubmitError(null)
  }

  return (
    <section className={styles.section} id="lead-form" ref={formRef}>
      <div className={styles.sectionInner}>
        <div className={styles.formSection}>
          <div className={styles.eyebrow}>Priority intake</div>
          <h2>Tell us about your event and we’ll send curated venues within 24 hours</h2>
          <p>How can we reach you?</p>

          <div className={styles.formCard}>
            {selectedSpace && (
              <div
                style={{
                  backgroundColor: '#f0f7ff',
                  border: '1px solid #cfe0ff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setSelectedSpace(null)
                    onClearSelectedSpace?.()
                  }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Change selection
                </button>
              </div>
            )}
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
                {submitError && (
                  <div
                    className={styles.error}
                    style={{
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#fee',
                      border: '1px solid #fcc',
                      borderRadius: '4px',
                    }}
                  >
                    {submitError}
                  </div>
                )}
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
                      <label htmlFor="email">Email*</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number*</label>
                      <div className={styles.phoneField}>
                        <PhoneInput
                          id="phone"
                          name="phone"
                          international
                          defaultCountry="UG"
                          value={formData.phone}
                          onChange={(value) => {
                            let nextValue = value || ''
                            if (nextValue.startsWith('+256') && nextValue.length > UG_E164_LENGTH) {
                              nextValue = nextValue.slice(0, UG_E164_LENGTH)
                            }
                            setFormData((prev) => ({ ...prev, phone: nextValue }))
                            setErrors((prev) => ({ ...prev, phone: undefined }))
                          }}
                          onBlur={() => {
                            if (formData.phone && !isValidPhoneNumber(formData.phone)) {
                              setErrors((prev) => ({
                                ...prev,
                                phone: 'Enter a valid phone number',
                              }))
                            }
                          }}
                          placeholder="+256 700 000000"
                        />
                      </div>
                      {errors.phone && <span className={styles.error}>{errors.phone}</span>}
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

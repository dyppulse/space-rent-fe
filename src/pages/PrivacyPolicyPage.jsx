import { Box, Container, Typography, Paper, Divider } from '@mui/material'

function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Privacy Policy
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last Updated:{' '}
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Typography>

      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="body1" paragraph>
          Welcome to SpaceHire. We are committed to protecting your privacy and ensuring you have a
          positive experience while using our platform. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our space rental platform.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          1. Information We Collect
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          1.1 Personal Information
        </Typography>
        <Typography variant="body1" paragraph>
          When you create an account, make a booking, or list a space, we collect information
          including:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Name, email address, and phone number
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Profile information and preferences
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Payment and billing information (processed securely through third-party providers)
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              For space owners: business information, property details, and verification documents
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          1.2 Booking Information
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information related to your bookings, including event dates, times, guest
          counts, and special requests, to facilitate the booking process between you and space
          owners.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          1.3 Usage Information
        </Typography>
        <Typography variant="body1" paragraph>
          We automatically collect information about how you interact with our platform, including:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Device information (IP address, browser type, operating system)
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Log data (pages visited, features used, time spent)
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Location data (when you search for spaces by location)
            </Typography>
          </li>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          2. How We Use Your Information
        </Typography>

        <Typography variant="body1" paragraph>
          We use the information we collect to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Provide, maintain, and improve our services
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Process and manage bookings between clients and space owners
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Send booking confirmations, updates, and transaction-related communications
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Verify space owner identities and ensure platform security
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Respond to your inquiries and provide customer support
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Send marketing communications (with your consent, where required)
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Detect, prevent, and address technical issues and security threats
            </Typography>
          </li>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          3. Information Sharing and Disclosure
        </Typography>

        <Typography variant="body1" paragraph>
          We may share your information in the following circumstances:
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          3.1 With Space Owners and Clients
        </Typography>
        <Typography variant="body1" paragraph>
          When you make a booking, we share your name, contact information, and booking details with
          the space owner. Similarly, space owners' contact information is shared with clients for
          booking-related communications.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          3.2 Service Providers
        </Typography>
        <Typography variant="body1" paragraph>
          We may share information with third-party service providers who help us operate our
          platform, including payment processors, email services, cloud hosting providers, and
          analytics services.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          3.3 Legal Requirements
        </Typography>
        <Typography variant="body1" paragraph>
          We may disclose information if required by law, legal process, or government request, or
          to protect the rights, property, or safety of SpaceHire, our users, or others.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          3.4 Business Transfers
        </Typography>
        <Typography variant="body1" paragraph>
          If SpaceHire is involved in a merger, acquisition, or sale of assets, your information may
          be transferred as part of that transaction.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          4. Data Security
        </Typography>

        <Typography variant="body1" paragraph>
          We implement appropriate technical and organizational security measures to protect your
          personal information from unauthorized access, disclosure, alteration, or destruction.
          These measures include encryption, secure server infrastructure, and regular security
          assessments. However, no method of transmission over the Internet is 100% secure, and we
          cannot guarantee absolute security.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          5. Your Rights and Choices
        </Typography>

        <Typography variant="body1" paragraph>
          You have the right to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Access and update your personal information through your account settings
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Request deletion of your account and associated data
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Opt-out of marketing communications by clicking unsubscribe in our emails
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Request a copy of your personal data
            </Typography>
          </li>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          6. Cookies and Tracking Technologies
        </Typography>

        <Typography variant="body1" paragraph>
          We use cookies and similar tracking technologies to enhance your experience, analyze
          platform usage, and assist with marketing efforts. You can control cookie preferences
          through your browser settings. Note that disabling cookies may affect certain features of
          our platform.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          7. Data Retention
        </Typography>

        <Typography variant="body1" paragraph>
          We retain your personal information for as long as necessary to provide our services,
          comply with legal obligations, resolve disputes, and enforce our agreements. When you
          delete your account, we will delete or anonymize your personal information, except where
          we are required to retain it for legal or legitimate business purposes.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          8. Children's Privacy
        </Typography>

        <Typography variant="body1" paragraph>
          SpaceHire is not intended for individuals under the age of 18. We do not knowingly collect
          personal information from children. If you believe we have collected information from a
          child, please contact us immediately.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          9. International Data Transfers
        </Typography>

        <Typography variant="body1" paragraph>
          Your information may be transferred to and processed in countries other than your own. By
          using SpaceHire, you consent to the transfer of your information to these countries. We
          take appropriate measures to ensure your information receives adequate protection in
          accordance with this Privacy Policy.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          10. Changes to This Privacy Policy
        </Typography>

        <Typography variant="body1" paragraph>
          We may update this Privacy Policy from time to time. We will notify you of any material
          changes by posting the new Privacy Policy on this page and updating the "Last Updated"
          date. Your continued use of SpaceHire after changes become effective constitutes
          acceptance of the updated policy.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          11. Contact Us
        </Typography>

        <Typography variant="body1" paragraph>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data
          practices, please contact us at:
        </Typography>

        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, my: 2 }}>
          <Typography variant="body1" component="div">
            <strong>Email:</strong> dyppulse@gmail.com
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic', color: 'text.secondary' }}>
          By using SpaceHire, you acknowledge that you have read and understood this Privacy Policy
          and agree to the collection, use, and disclosure of your information as described herein.
        </Typography>
      </Paper>
    </Container>
  )
}

export default PrivacyPolicyPage

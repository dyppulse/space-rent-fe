import { Box, Container, Typography, Paper, Divider } from '@mui/material'

function TermsOfServicePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Terms of Service
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
          Welcome to SpaceHire. These Terms of Service ("Terms") govern your access to and use of
          our space rental platform. By creating an account, making a booking, or listing a space,
          you agree to be bound by these Terms. Please read them carefully.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" paragraph>
          By accessing or using SpaceHire, you agree to comply with and be bound by these Terms of
          Service. If you do not agree with any part of these Terms, you must not use our platform.
          We reserve the right to modify these Terms at any time, and your continued use of the
          platform after changes are posted constitutes acceptance of the modified Terms.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          2. Description of Service
        </Typography>
        <Typography variant="body1" paragraph>
          SpaceHire is an online platform that connects space owners ("Owners") with individuals
          seeking to rent spaces for events ("Clients"). We facilitate the booking process and
          provide tools for managing listings and bookings. SpaceHire is not a party to the
          transaction between Owners and Clients, nor do we own, manage, or control the spaces
          listed on our platform.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          3. User Accounts
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          3.1 Account Registration
        </Typography>
        <Typography variant="body1" paragraph>
          To use certain features of SpaceHire, you must create an account. You agree to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Provide accurate, current, and complete information during registration
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Maintain and promptly update your account information
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Maintain the security of your account password
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Accept responsibility for all activities that occur under your account
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Be at least 18 years old to create an account
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          3.2 Owner Verification
        </Typography>
        <Typography variant="body1" paragraph>
          Space owners must undergo verification by our administrators before listing spaces. We
          reserve the right to verify ownership, business registration, and other relevant
          documentation. Owners agree to provide accurate information and documentation as
          requested.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          4. Space Listings and Bookings
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          4.1 Space Listings
        </Typography>
        <Typography variant="body1" paragraph>
          Owners are responsible for:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Providing accurate descriptions, images, pricing, and availability for their spaces
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Maintaining the condition and safety of their listed spaces
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Complying with all applicable laws, regulations, and local ordinances
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Responding promptly to booking requests and inquiries
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Obtaining necessary licenses, permits, and insurance for their spaces
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          4.2 Bookings
        </Typography>
        <Typography variant="body1" paragraph>
          Clients agree to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Provide accurate booking information including event dates, times, and guest counts
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Use the space in accordance with the Owner's rules and applicable laws
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Leave the space in the same condition as found
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Comply with capacity limits and safety regulations
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          4.3 Booking Cancellations
        </Typography>
        <Typography variant="body1" paragraph>
          Cancellation policies vary by space and are specified in the space listing. Refunds, if
          applicable, will be processed according to the cancellation policy in effect at the time
          of booking. SpaceHire is not responsible for cancellations by Owners or Clients, except as
          otherwise stated in our policies.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          5. Payments and Fees
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          5.1 Booking Fees
        </Typography>
        <Typography variant="body1" paragraph>
          Clients agree to pay the total booking amount, including any fees, as specified at the
          time of booking. Payments are processed through secure third-party payment processors.
          SpaceHire may charge service fees as disclosed at the time of booking.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          5.2 Owner Payments
        </Typography>
        <Typography variant="body1" paragraph>
          Owners will receive payment for completed bookings, minus applicable service fees, as
          specified in the Owner agreement. Payment processing times and methods are subject to our
          payment policies.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          6. Prohibited Activities
        </Typography>
        <Typography variant="body1" paragraph>
          You agree not to:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              Use the platform for any illegal or unauthorized purpose
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Violate any laws, regulations, or third-party rights
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Post false, misleading, or fraudulent information
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Harass, threaten, or harm other users
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Interfere with or disrupt the platform's functionality
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Attempt to circumvent our security measures or payment systems
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Use automated systems (bots, scrapers) to access or use the platform
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Infringe on intellectual property rights of SpaceHire or others
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
          7. Intellectual Property
        </Typography>
        <Typography variant="body1" paragraph>
          The SpaceHire platform, including its design, text, graphics, logos, and software, is the
          property of SpaceHire and is protected by copyright, trademark, and other intellectual
          property laws. You may not reproduce, modify, distribute, or create derivative works
          without our express written permission. Content you post (including space listings,
          reviews, and photos) grants SpaceHire a non-exclusive, royalty-free license to use,
          display, and distribute such content on the platform.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          8. Disclaimers and Limitations of Liability
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          8.1 Platform Availability
        </Typography>
        <Typography variant="body1" paragraph>
          SpaceHire is provided "as is" and "as available" without warranties of any kind. We do not
          guarantee that the platform will be uninterrupted, error-free, or free from viruses. You
          use the platform at your own risk.
        </Typography>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          8.2 Third-Party Transactions
        </Typography>
        <Typography variant="body1" paragraph>
          SpaceHire acts as an intermediary platform. We are not responsible for:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
          <li>
            <Typography variant="body1" component="span">
              The condition, safety, or legality of listed spaces
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              The accuracy of space descriptions or images provided by Owners
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Disputes between Owners and Clients
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="span">
              Injuries, damages, or losses occurring at or related to booked spaces
            </Typography>
          </li>
        </Box>

        <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
          8.3 Limitation of Liability
        </Typography>
        <Typography variant="body1" paragraph>
          To the maximum extent permitted by law, SpaceHire, its officers, directors, employees, and
          affiliates shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of profits or revenues, whether incurred directly or
          indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from
          your use of the platform.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          9. Indemnification
        </Typography>
        <Typography variant="body1" paragraph>
          You agree to indemnify and hold harmless SpaceHire, its officers, directors, employees,
          and affiliates from any claims, damages, losses, liabilities, and expenses (including
          reasonable attorneys' fees) arising out of or relating to your use of the platform, your
          violation of these Terms, your violation of any rights of another party, or your
          interaction with other users.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          10. Termination
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to suspend or terminate your account and access to the platform at
          any time, with or without notice, for any reason, including but not limited to violation
          of these Terms. Upon termination, your right to use the platform will immediately cease.
          You may also terminate your account at any time by contacting us or using the account
          deletion feature in your settings.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          11. Dispute Resolution
        </Typography>
        <Typography variant="body1" paragraph>
          In the event of disputes between Owners and Clients, we encourage parties to resolve
          issues directly. SpaceHire may, but is not obligated to, assist in dispute resolution. For
          disputes between users and SpaceHire, you agree to first contact us to attempt to resolve
          the dispute. If the dispute cannot be resolved, it shall be resolved through binding
          arbitration or in the courts of Uganda, as applicable by law.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          12. Governing Law
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms shall be governed by and construed in accordance with the laws of Uganda,
          without regard to its conflict of law provisions.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          13. Changes to Terms
        </Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify these Terms at any time. We will notify users of material
          changes by posting the updated Terms on this page and updating the "Last Updated" date.
          Your continued use of the platform after changes are posted constitutes acceptance of the
          modified Terms.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          14. Contact Information
        </Typography>
        <Typography variant="body1" paragraph>
          If you have questions about these Terms of Service, please contact us at:
        </Typography>

        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, my: 2 }}>
          <Typography variant="body1" component="div">
            <strong>Email:</strong> dyppulse@gmail.com
          </Typography>
          <Typography variant="body1" component="div" sx={{ mt: 1 }}>
            <strong>Phone:</strong> +256 775 681 668
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 4, fontStyle: 'italic', color: 'text.secondary' }}>
          By using SpaceHire, you acknowledge that you have read, understood, and agree to be bound
          by these Terms of Service.
        </Typography>
      </Paper>
    </Container>
  )
}

export default TermsOfServicePage

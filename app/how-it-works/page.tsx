import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, CreditCard, CheckCircle, HelpCircle } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How SpaceHire Works</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We make it easy to find and book the perfect space for your next event, meeting, or creative project.
        </p>
      </div>

      {/* For Clients */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For Clients</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Find Your Space</h3>
                <p className="text-gray-600">
                  Browse our collection of unique venues, studios, and meeting spaces. Use filters to narrow down by
                  location, capacity, price, and amenities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Book Your Date</h3>
                <p className="text-gray-600">
                  Select your preferred date and time, fill in your details, and submit your booking request. No login
                  required!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Confirmation</h3>
                <p className="text-gray-600">
                  The space owner will review and confirm your booking. You'll receive all the details you need for your
                  event via email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Link href="/spaces">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
              Find a Space
            </Button>
          </Link>
        </div>
      </div>

      {/* For Space Owners */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For Space Owners</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-teal-600"
                  >
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                    <path d="M1 21h22" />
                    <path d="M7 14.5V17" />
                    <path d="M17 14.5V17" />
                    <path d="M12 14.5V17" />
                    <path d="M7 8.5h.01" />
                    <path d="M12 8.5h.01" />
                    <path d="M17 8.5h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. List Your Space</h3>
                <p className="text-gray-600">
                  Create an account and add your space with photos, description, pricing, and availability. It's free to
                  list!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-teal-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Manage Bookings</h3>
                <p className="text-gray-600">
                  Receive booking requests, communicate with clients, and confirm or decline bookings through your
                  dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Paid</h3>
                <p className="text-gray-600">
                  Earn money from your space when it would otherwise be unused. Set your own prices and availability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
              List Your Space
            </Button>
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Got questions? We've got answers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
              How do I book a space?
            </h3>
            <p className="text-gray-600">
              Browse our listings, select a space you like, choose your date and time, and submit a booking request. The
              space owner will confirm your booking.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
              Do I need to create an account to book?
            </h3>
            <p className="text-gray-600">
              No, you don't need an account to book a space. Just provide your contact information during the booking
              process.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
              How do I list my space?
            </h3>
            <p className="text-gray-600">
              Create an account as a space owner, then add your space details, photos, pricing, and availability. Your
              space will be visible to potential clients.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
              Is there a fee to list my space?
            </h3>
            <p className="text-gray-600">
              No, listing your space is completely free. We only charge a small service fee when a booking is confirmed.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
              What if I need to cancel my booking?
            </h3>
            <p className="text-gray-600">
              Cancellation policies vary by space. Please check the specific space's cancellation policy before booking.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
              How do payments work?
            </h3>
            <p className="text-gray-600">
              Currently, payments are handled directly between you and the space owner. We're working on adding
              integrated payments soon!
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Have More Questions? Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

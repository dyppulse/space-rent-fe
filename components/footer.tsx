import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">SpaceRent</h3>
            <p className="text-gray-300">Find and book unique venues for your next event.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/spaces" className="text-gray-300 hover:text-white">
                  All Spaces
                </Link>
              </li>
              <li>
                <Link href="/spaces?type=event" className="text-gray-300 hover:text-white">
                  Event Venues
                </Link>
              </li>
              <li>
                <Link href="/spaces?type=studio" className="text-gray-300 hover:text-white">
                  Studios
                </Link>
              </li>
              <li>
                <Link href="/spaces?type=conference" className="text-gray-300 hover:text-white">
                  Conference Rooms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Host</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/host" className="text-gray-300 hover:text-white">
                  List Your Space
                </Link>
              </li>
              <li>
                <Link href="/host/resources" className="text-gray-300 hover:text-white">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/host/guidelines" className="text-gray-300 hover:text-white">
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-center">&copy; {new Date().getFullYear()} SpaceRent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

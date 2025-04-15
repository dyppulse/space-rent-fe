import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Filter } from "lucide-react"
import SpaceGrid from "@/components/space-grid"
import { mockSpaces } from "@/lib/mock-data"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-500 to-emerald-500 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Find the perfect space for your next event
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-white sm:text-2xl md:max-w-3xl">
              Discover and book unique venues, studios, and meeting spaces without the hassle.
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input type="text" placeholder="Search by location or venue type" className="pl-10 w-full" />
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Available Spaces</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Space Grid */}
          <SpaceGrid spaces={mockSpaces} />
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Own a space? List it on our platform</h2>
          <p className="mt-4 text-xl text-gray-600">
            Join our community of space owners and start earning from your venue today.
          </p>
          <div className="mt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                List Your Space
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

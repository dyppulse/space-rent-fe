import Image from "next/image"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Users, CheckCircle2 } from "lucide-react"
import BookingForm from "@/components/booking-form"
import { mockSpaces } from "@/lib/mock-data"

interface SpacePageProps {
  params: {
    id: string
  }
}

export default function SpacePage({ params }: SpacePageProps) {
  // In a real app, fetch this data from your database
  const space = mockSpaces.find((space) => space.id === params.id)

  if (!space) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Space details */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{space.name}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-5 w-5 mr-1" />
            <span>{space.location}</span>
          </div>

          {/* Image gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="md:col-span-2 relative h-80 rounded-lg overflow-hidden">
              <Image src={space.images[0] || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
            </div>
            {space.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${space.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Tabs for details */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Capacity: {space.capacity} people</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <span>
                      ${space.price}/{space.priceUnit}
                    </span>
                  </div>
                  <Badge className="bg-teal-100 text-teal-800">{space.type}</Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{space.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Space Details</h3>
                  <p className="text-gray-700">
                    This {space.type.toLowerCase()} is available for bookings. Perfect for{" "}
                    {space.type === "Event Venue"
                      ? "events, parties, and gatherings"
                      : space.type === "Conference Room"
                        ? "meetings, workshops, and presentations"
                        : "creative work, photoshoots, and productions"}
                    .
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {space.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-teal-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-4">
              <div className="space-y-4">
                <p className="text-gray-700">
                  Located in {space.location}. Detailed directions will be provided after booking.
                </p>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map will be displayed here</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {space.rating ? (
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl font-bold mr-2">{space.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(space.rating) ? "text-yellow-500" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">Reviews will be displayed here.</p>
                  </div>
                ) : (
                  <p className="text-gray-700">No reviews yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Booking form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Book this space</h2>
              <BookingForm spaceId={space.id} price={space.price} priceUnit={space.priceUnit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

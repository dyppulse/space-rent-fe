import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import type { Space } from "@/lib/types"

interface SpaceGridProps {
  spaces: Space[]
}

export default function SpaceGrid({ spaces }: SpaceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {spaces.map((space) => (
        <Link href={`/spaces/${space.id}`} key={space.id}>
          <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image src={space.images[0] || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
              {space.featured && <Badge className="absolute top-2 right-2 bg-teal-600">Featured</Badge>}
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-1">{space.name}</h3>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{space.location}</span>
                  </div>
                </div>
                {space.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{space.rating}</span>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-gray-600 text-sm line-clamp-2">{space.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {space.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {space.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{space.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold">${space.price}</span>
                  <span className="text-gray-500 text-sm">/{space.priceUnit}</span>
                </div>
                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">{space.type}</Badge>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

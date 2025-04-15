import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash, Eye } from "lucide-react"
import type { Space } from "@/lib/types"

interface SpacesListProps {
  spaces: Space[]
}

export default function SpacesList({ spaces }: SpacesListProps) {
  return (
    <div className="grid gap-4">
      {spaces.map((space) => (
        <Card key={space.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                <Image src={space.images[0] || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
                {space.featured && <Badge className="absolute top-2 right-2 bg-teal-600">Featured</Badge>}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{space.name}</h3>
                    <p className="text-sm text-gray-500">{space.location}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/spaces/${space.id}`} className="flex items-center w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/spaces/${space.id}/edit`} className="flex items-center w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 line-clamp-2">{space.description}</p>
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
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">${space.price}</span>
                    <span className="text-gray-500 text-sm">/{space.priceUnit}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/spaces/${space.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/spaces/${space.id}`}>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

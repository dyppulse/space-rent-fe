import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Calendar, Filter, Grid3X3, List } from "lucide-react"
import SpaceGrid from "@/components/space-grid"
import { mockSpaces } from "@/lib/mock-data"

export default function SpacesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Spaces</h1>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input type="text" placeholder="Search by location or venue type" className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Location</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Date</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Space Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="event-venue">Event Venue</SelectItem>
                <SelectItem value="wedding-venue">Wedding Venue</SelectItem>
                <SelectItem value="conference-room">Conference Room</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Capacity</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Size</SelectItem>
                <SelectItem value="small">Small (1-20)</SelectItem>
                <SelectItem value="medium">Medium (21-50)</SelectItem>
                <SelectItem value="large">Large (51-100)</SelectItem>
                <SelectItem value="xl">Extra Large (100+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="pt-2 px-2">
              <Slider defaultValue={[0, 1000]} min={0} max={1000} step={50} />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{mockSpaces.length} spaces available</h2>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">View:</span>
          <Tabs defaultValue="grid" className="w-auto">
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-3">
                <Grid3X3 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <SpaceGrid spaces={mockSpaces} />
    </div>
  )
}

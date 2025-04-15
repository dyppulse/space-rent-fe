import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Home, Calendar, Settings, Users } from "lucide-react"
import SpacesList from "@/components/spaces-list"
import BookingsList from "@/components/bookings-list"
import { mockSpaces, mockBookings } from "@/lib/mock-data"

export default function DashboardPage() {
  // Filter spaces for the current user (in a real app, this would be based on the authenticated user)
  const userSpaces = mockSpaces.filter((space) => space.ownerId === "user-1")

  // Filter bookings for the user's spaces
  const userSpaceIds = userSpaces.map((space) => space.id)
  const userBookings = mockBookings.filter((booking) => userSpaceIds.includes(booking.spaceId))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your spaces and bookings</p>
        </div>
        <Link href="/dashboard/spaces/new">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Space
          </Button>
        </Link>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userSpaces.length}</div>
            <p className="text-xs text-muted-foreground">
              {userSpaces.length > 0 ? "+1 space this month" : "Add your first space"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBookings.filter((b) => b.status === "confirmed").length}</div>
            <p className="text-xs text-muted-foreground">
              {userBookings.filter((b) => b.status === "pending").length} pending requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${userBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
            </div>
            <p className="text-xs text-muted-foreground">+$1,200 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="spaces" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spaces" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>My Spaces</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spaces" className="space-y-4">
          {userSpaces.length > 0 ? (
            <SpacesList spaces={userSpaces} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No spaces yet</CardTitle>
                <CardDescription>
                  You haven&apos;t added any spaces to your account yet. Get started by adding your first space.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/spaces/new">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Space
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {userBookings.length > 0 ? (
            <BookingsList bookings={userBookings} spaces={userSpaces} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No bookings yet</CardTitle>
                <CardDescription>You don&apos;t have any bookings for your spaces yet.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>View and manage your clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Client management features will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account settings will be available in the next update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

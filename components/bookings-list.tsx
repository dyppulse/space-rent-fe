import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Booking, Space } from "@/lib/types"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

interface BookingsListProps {
  bookings: Booking[]
  spaces: Space[]
}

export default function BookingsList({ bookings, spaces }: BookingsListProps) {
  // Helper function to get space name by ID
  const getSpaceName = (spaceId: string) => {
    const space = spaces.find((s) => s.id === spaceId)
    return space ? space.name : "Unknown Space"
  }

  // Group bookings by status
  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
  const pastBookings = bookings.filter((b) => b.status === "cancelled" || b.status === "completed")

  const renderBookingCard = (booking: Booking) => {
    return (
      <Card key={booking.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{booking.customerName}</h3>
                <Badge
                  className={
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{getSpaceName(booking.spaceId)}</p>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.eventDate), "MMMM d, yyyy")} • {booking.startTime} - {booking.endTime}
              </p>
              <p className="text-sm text-gray-600">
                {booking.customerEmail} • {booking.customerPhone}
              </p>
            </div>
            <div className="flex flex-col sm:items-end justify-between gap-2">
              <div className="text-right">
                <p className="font-semibold">${booking.totalPrice}</p>
                <p className="text-xs text-gray-500">Total price</p>
              </div>
              {booking.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>
          {booking.notes && (
            <div className="mt-3 pt-3 border-t text-sm text-gray-600">
              <p className="font-medium">Notes:</p>
              <p>{booking.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {pendingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          {pendingBookings.map(renderBookingCard)}
        </div>
      )}

      {confirmedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          {confirmedBookings.map(renderBookingCard)}
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          {pastBookings.map(renderBookingCard)}
        </div>
      )}

      {bookings.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No bookings yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don&apos;t have any bookings for your spaces yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

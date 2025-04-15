"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
  spaceId: string
  price: number
  priceUnit: string
}

export default function BookingForm({ spaceId, price, priceUnit }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Booking request submitted!",
        description: "The space owner will contact you shortly to confirm your booking.",
      })
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Your name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="your@email.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" placeholder="(123) 456-7890" required />
      </div>

      <div className="space-y-2">
        <Label>Event Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
              <Clock className="h-4 w-4" />
            </span>
            <Input id="startTime" type="time" className="rounded-l-none" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
              <Clock className="h-4 w-4" />
            </span>
            <Input id="endTime" type="time" className="rounded-l-none" required />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Event Details</Label>
        <Textarea
          id="notes"
          placeholder="Tell us about your event (type, number of guests, special requirements, etc.)"
          rows={3}
        />
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Price</span>
          <span className="font-semibold">
            ${price}/{priceUnit}
          </span>
        </div>

        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Request to Book"}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-2">
          You won't be charged yet. The space owner will confirm availability.
        </p>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { sendContactEmail } from "@/app/actions/send-email"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.target)
      const result = await sendContactEmail(formData)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
        // Reset the form
        event.target.reset()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" name="name" placeholder="Your name" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" placeholder="Your email address" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="Your phone number (optional)" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" name="message" placeholder="Your message" className="min-h-[120px]" required />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}


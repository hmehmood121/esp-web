"use server"

import { Resend } from "resend"

// Initialize Resend with your API key
// You'll need to add RESEND_API_KEY to your environment variables
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

export async function sendContactEmail(formData) {
  try {
    const name = formData.get("name")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const message = formData.get("message")

    // Validate inputs
    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Use your verified domain in production
      to: "hmehmood121@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return {
        success: false,
        message: "Failed to send email. Please try again later.",
      }
    }

    return {
      success: true,
      message: "Your message has been sent successfully!",
    }
  } catch (error) {
    console.error("Error in sendContactEmail:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}


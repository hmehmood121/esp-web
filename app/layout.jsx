import "./globals.css"
import { Toaster } from "@/components/toaster"

export const metadata = {
  title: "Esproductionz",
  description:
    "esproductionz is a media compay that provides services in Filmography, Videography and Development based in Saint Lucia.",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}


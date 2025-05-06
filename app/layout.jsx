import "./globals.css"
import { Toaster } from "sonner"

export const metadata = {
  title: "Esproductionz",
  description:
    "esproductionz is a services based company that provides services in Filmography, Videography and Development based in Saint Lucia.",
    icons: {
      icon: {url: "/icon.png"},
     
    },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position='top-center' />
      </body>
    </html>
  )
}


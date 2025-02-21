import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Esproductionz',
  description: 'esproductionz is a media compay that provides services in Filmography, Videography and Development based in Saint Lucia.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

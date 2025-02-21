import Image from "next/image"
import Link from "next/link"
import { Menu, Star, Quote, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Add this style element at the top of the component
const scrollStyle = {
  scrollBehavior: "smooth",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={scrollStyle}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
              <span className="hidden font-bold sm:inline-block">MultiMedia Co.</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="#about" scroll={false}>
                About
              </Link>
              <Link href="#why-us" scroll={false}>
                Why Us
              </Link>
              <Link href="#ceo-message" scroll={false}>
                CEO Message
              </Link>
              <Link href="#services" scroll={false}>
                Services
              </Link>
              <Link href="#gallery" scroll={false}>
                Gallery
              </Link>
              <Link href="#team" scroll={false}>
                Team
              </Link>
              <Link href="#testimonials" scroll={false}>
                Testimonials
              </Link>
              <Link href="#clients" scroll={false}>
                Clients
              </Link>
              <Link href="#contact" scroll={false}>
                Contact
              </Link>
            </nav>
          </div>
          <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 py-2 px-3 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </header>
      <main className="flex-1">
        <section id="hero" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Bringing Your Vision to Life
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We specialize in photography, videography, audio production, web and mobile app development.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">About Us</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  MultiMedia Co. is a creative powerhouse founded in 2023. We bring together experts in photography,
                  videography, audio production, web development, and mobile app creation to offer comprehensive
                  multimedia solutions.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Our mission is to help businesses and individuals bring their visions to life through cutting-edge
                  technology and artistic excellence. With a passion for innovation and a commitment to quality, we
                  strive to exceed expectations in every project we undertake.
                </p>
                <Button>Learn More</Button>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="About Us" layout="fill" objectFit="cover" />
              </div>
            </div>
          </div>
        </section>
        <section id="why-us" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Expertise Across Mediums",
                  description:
                    "Our team of specialists excels in photography, videography, web, and mobile app development, offering comprehensive solutions.",
                },
                {
                  title: "Cutting-Edge Technology",
                  description:
                    "We leverage the latest tools and techniques to deliver innovative and high-quality results for every project.",
                },
                {
                  title: "Tailored Approach",
                  description:
                    "We understand that each client is unique, so we customize our services to meet your specific needs and goals.",
                },
                {
                  title: "Collaborative Process",
                  description:
                    "We work closely with our clients, ensuring clear communication and incorporating feedback throughout the project lifecycle.",
                },
                {
                  title: "Timely Delivery",
                  description:
                    "We pride ourselves on meeting deadlines without compromising on quality, respecting your time and project timelines.",
                },
                {
                  title: "Ongoing Support",
                  description:
                    "Our relationship doesn't end at project delivery. We provide continued support to ensure long-term success.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="ceo-message" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="CEO Portrait" layout="fill" objectFit="cover" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  A Message from Our CEO
                </h2>
                <div className="relative">
                  <Quote className="absolute top-0 left-0 text-gray-200 dark:text-gray-800" size={48} />
                  <blockquote className="pl-16 pt-8 text-gray-500 dark:text-gray-400 italic">
                    At MultiMedia Co., we believe in the power of creativity and technology to transform ideas into
                    reality. Our team is dedicated to delivering exceptional quality and innovation in every project we
                    undertake.
                  </blockquote>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold">Jane Doe</h3>
                  <p className="text-gray-500 dark:text-gray-400">Founder & CEO, MultiMedia Co.</p>
                </div>
                <div className="mt-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Jane Doe is a visionary leader with over 15 years of experience in the multimedia industry. She
                    founded MultiMedia Co. with the goal of bridging the gap between cutting-edge technology and
                    creative expression. Under her guidance, our company has grown to become a leading force in
                    photography, videography, audio production, and digital development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["Photography", "Videography", "Audio Production", "Web Development", "Mobile App Development"].map(
                (service) => (
                  <div
                    key={service}
                    className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                  >
                    <Image src="/placeholder.svg" alt={service} width={64} height={64} className="mb-4" />
                    <h3 className="text-xl font-bold mb-2">{service}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
        <section id="gallery" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Gallery
            </h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="photography">Photography</TabsTrigger>
                <TabsTrigger value="videography">Videography</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src={`/placeholder.svg`} alt={`Gallery Image ${i + 1}`} layout="fill" objectFit="cover" />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="photography" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg`}
                      alt={`Photography Image ${i + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="videography" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg`}
                      alt={`Videography Image ${i + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="development" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg`}
                      alt={`Development Image ${i + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section id="team" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {["John Doe", "Jane Smith", "Mike Johnson", "Emily Brown"].map((member) => (
                <div key={member} className="flex flex-col items-center text-center">
                  <Image src="/placeholder.svg" alt={member} width={200} height={200} className="rounded-full mb-4" />
                  <h3 className="text-xl font-bold mb-2">{member}</h3>
                  <p className="text-gray-500 dark:text-gray-400">Position</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
                  </p>
                  <p className="font-bold">- Happy Client {i}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="clients" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Companies We've Worked With
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Image
                  key={i}
                  src="/placeholder.svg"
                  alt={`Company ${i}`}
                  width={150}
                  height={75}
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        </section>
        <section id="download-app" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  Download Our Mobile App
                </h2>
                <p className="text-xl mb-6">
                  Get access to exclusive content, special offers, and easy booking right from your phone.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z" />
                    </svg>
                    Download for Android
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.885 17.125h-7.77l-3.787-6.564 3.787-6.563h7.77l3.787 6.563-3.787 6.564z" />
                    </svg>
                    Download for iOS
                  </a>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="Mobile App Preview" layout="fill" objectFit="cover" />
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Contact Us</h2>
            <form className="max-w-md mx-auto space-y-4">
              <Input type="text" placeholder="Name" />
              <Input type="email" placeholder="Email" />
              <Input type="tel" placeholder="Phone" />
              <Textarea placeholder="Message" />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">MultiMedia Co.</h3>
              <p>Bringing your vision to life since 2023.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="#about" scroll={false}>
                  About
                </Link>
                <Link href="#why-us" scroll={false}>
                  Why Us
                </Link>
                <Link href="#ceo-message" scroll={false}>
                  CEO Message
                </Link>
                <Link href="#services" scroll={false}>
                  Services
                </Link>
                <Link href="#gallery" scroll={false}>
                  Gallery
                </Link>
                <Link href="#team" scroll={false}>
                  Team
                </Link>
                <Link href="#testimonials" scroll={false}>
                  Testimonials
                </Link>
                <Link href="#clients" scroll={false}>
                  Clients
                </Link>
                <Link href="#contact" scroll={false}>
                  Contact
                </Link>
                <Link href="#download-app" scroll={false}>
                  Download App
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <p>123 Main St, Anytown, USA 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@multimediaco.com</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 MultiMedia Co. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


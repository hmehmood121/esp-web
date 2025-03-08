"use client"

import Image from "next/image"
import Link from "next/link"
import { Menu, Star, Quote, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { db } from "@/firebase" // Adjust path based on your setup
import { collection, getDocs } from "firebase/firestore"
import { ContactForm } from "@/components/contact-form"

function MobileNav() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault()
    setOpen(false)
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }



  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          <a href="#services" onClick={(e) => handleLinkClick(e, "services")} className="text-lg font-medium">
            Services
          </a>
          <a href="#gallery" onClick={(e) => handleLinkClick(e, "gallery")} className="text-lg font-medium">
            Gallery
          </a>
          <a href="#team" onClick={(e) => handleLinkClick(e, "team")} className="text-lg font-medium">
            Team
          </a>
          <a href="#testimonials" onClick={(e) => handleLinkClick(e, "testimonials")} className="text-lg font-medium">
            Testimonials
          </a>
          <a href="#clients" onClick={(e) => handleLinkClick(e, "clients")} className="text-lg font-medium">
            Clients
          </a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, "contact")} className="text-lg font-medium">
            Contact
          </a>
          <Button asChild className="mt-4">
            <a href="/admin">Login</a>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

// Add this style element at the top of the component
const scrollStyle = {
  scrollBehavior: "smooth",
}

export default function Home() {
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "team")) // Replace with your Firestore collection name
        const members = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setTeamMembers(members)
      } catch (error) {
        console.error("Error fetching team members:", error)
      }
    }

    fetchTeamMembers()
  }, [])

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }
  const photographyImages = [
    "https://i.ytimg.com/vi/iFTkqwnMWzU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBuAs-QqklxZhErgS7ahlKyOG3JuQ",
    "https://www.travelandleisure.com/thmb/gonuRZ7u4e_gzqgXN3EWDcNaOnY=/654x434/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-st-lucia-lead-image-STLUCIA1024-cab707044fad44afb8d85fec352f4a50.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFaEhXQo0MXC5VfMAJqYrCBj5SIqojJruxog&s",
    "https://whereintheworldisnina.com/wp-content/uploads/2023/11/sugar-beach.jpg",
  ]

  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"))
        const videoUrls = querySnapshot.docs.map((doc) => doc.data().portfolio)

        console.log("vids", videoUrls)
        setVideos(videoUrls)
      } catch (error) {
        console.error("Error fetching videos:", error)
      }
    }

    fetchVideos()
  }, [])

  const handleScroll = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-screen-2xl mx-auto" style={scrollStyle}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl mx-auto items-center px-4 sm:px-6">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-4" href="/">
              <Image className="ml-2" src="/eslogo.png" alt="Logo" width={32} height={32} />
              <span className="hidden font-bold sm:inline-block">ESproductionz Co.</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="#services" onClick={(e) => scrollToSection(e, "services")}>
                Services
              </a>
              <a href="#gallery" onClick={(e) => scrollToSection(e, "gallery")}>
                Gallery
              </a>
              <a href="#team" onClick={(e) => scrollToSection(e, "team")}>
                Team
              </a>
              <a href="#testimonials" onClick={(e) => scrollToSection(e, "testimonials")}>
                Testimonials
              </a>
              <a href="#clients" onClick={(e) => scrollToSection(e, "clients")}>
                Clients
              </a>
              <a href="#contact" onClick={(e) => scrollToSection(e, "contact")}>
                Contact
              </a>
            </nav>
          </div>
          <div className="md:hidden flex items-center">
            <a className="flex items-center space-x-2" href="/">
              <Image src="/eslogo.png" alt="Logo" width={28} height={28} />
              <span className="font-bold">ESproductionz</span>
            </a>
          </div>
          <div className="flex-1 flex justify-end">
            <Button asChild variant="default" className="hidden md:flex">
              <a href="/admin">Login</a>
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section id="hero" className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Bringing Your Vision to Life
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We specialize in Photography, Videography, audio production, Web and Mobile app development.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Button onClick={handleScroll}>Get Started</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">About Us</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Esproductionz is a creative powerhouse founded in 2010. We bring together experts in photography,
                  videography, audio production, web development, and mobile app creation to offer comprehensive
                  multimedia solutions.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Our mission is to help businesses and individuals bring their visions to life through cutting-edge
                  technology and artistic excellence. With a passion for innovation and a commitment to quality, we
                  strive to exceed expectations in every project we undertake.
                </p>
                {/* <Button>Learn More</Button> */}
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="About Us" layout="fill" objectFit="cover" />
              </div>
            </div>
          </div>
        </section>
        <section id="why-us" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
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
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="./ernell.jpg" alt="CEO Portrait" layout="fill" objectFit="contain" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                  A Message from Our CEO
                </h2>
                <div className="relative">
                  <Quote className="absolute top-0 left-0 text-gray-200 dark:text-gray-800" size={48} />
                  <blockquote className="pl-16 pt-8 text-gray-500 dark:text-gray-400 italic">
                    At ESproductionz, we believe in the power of creativity and technology to transform ideas into
                    reality. Our team is dedicated to delivering exceptional quality and innovation in every project we
                    undertake.
                  </blockquote>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold">Ernell Sextius</h3>
                  <p className="text-gray-500 dark:text-gray-400">Founder & CEO, ESproductionz</p>
                </div>
                <div className="mt-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Ernell Sextius is a visionary leader with over 15 years of experience in the multimedia industry. He
                    founded ESproductionz Co. with the goal of bridging the gap between cutting-edge technology and
                    creative expression. Under her guidance, our company has grown to become a leading force in
                    photography, videography, audio production, and digital development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Image src="./video.png" width={64} height={64} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Videography</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Capturing stunning visuals to bring your story to life with high-quality cinematography.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Image src="./photo-camera.png" width={64} height={64} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Photography</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Professional photography that captures moments with precision, creativity, and style.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Image src="./sound-waves.png" width={64} height={64} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Audio</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Crystal-clear sound design, mixing, and recording for an immersive audio experience.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Image src="./software-developer.png" width={64} height={64} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Web Development</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Building sleek, responsive, and high-performance websites tailored to your needs.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Image src="./booking.png" width={64} height={64} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">App Development</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Crafting intuitive and feature-rich mobile apps for iOS and Android.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Image src="./3d-modeling.png" width={64} height={64} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">Animations</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Engaging motion graphics and animations that make your ideas come alive.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Gallery
            </h2>
            <Tabs defaultValue="photography" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="photography">Photography</TabsTrigger>
                <TabsTrigger value="videography">Videography</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
              </TabsList>

              <TabsContent
                value="photography"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {photographyImages.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Photography ${i + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent
                value="videography"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {videos.length > 0 ? (
                  videos.map((videoUrl, i) => {
                    const videoId = videoUrl.split("v=")[1] || videoUrl.split("youtu.be/")[1]
                    const embedUrl = `https://www.youtube.com/embed/${videoId?.split("?")[0]}`

                    return (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={embedUrl}
                          title={`YouTube video ${i + 1}`}
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-gray-500 col-span-full">Loading videos...</p>
                )}
              </TabsContent>

              <TabsContent
                value="development"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image src={`/placeholder.svg`} alt={`Development ${i + 1}`} layout="fill" objectFit="cover" />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="team" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div key={member.id} className="flex flex-col items-center text-center">
                    <div className="w-40 h-40 relative mb-4">
                      <Image
                        src={member.imageUrl || "/placeholder.svg"}
                        alt={member.name}
                        layout="fill"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{member.designation}</p>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full">Loading team members...</p>
              )}
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  The videography team captured every moment perfectly! The quality and editing exceeded our
                  expectations.
                </p>
                <p className="font-bold">- Keif Hoffman</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Their web development service transformed our business! The site is fast, user-friendly, and
                  beautifully designed.
                </p>
                <p className="font-bold">- Sarah Will</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  The photography and animations brought our brand to life. Professional, creative, and highly
                  recommended!
                </p>
                <p className="font-bold">- Rein Fill</p>
              </div>
            </div>
          </div>
        </section>
        <section id="clients" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Companies We've Worked With
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              <Image
                src="/12.jpg"
                width={150}
                height={75}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/13.jpg"
                width={150}
                height={75}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/14.png"
                width={150}
                height={75}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/24.jpg"
                width={150}
                height={75}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/25.jpg"
                width={150}
                height={75}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/27.jpg"
                width={150}
                height={75}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </section>
        <section id="download-app" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
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
                    href="https://play.google.com/store/apps/details?id=com.esproductionzz.esproductionzz&pli=1"
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
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Contact Us</h2>
            <div className="max-w-md mx-auto">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-800 text-white">
        <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ESproductionz Co.</h3>
              <p>Bringing your vision to life since 2010.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <nav className="grid grid-cols-2 gap-2">
                <Link href="#about" scroll={false}>
                  About
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
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <p>Saint Lucia</p>
              <p>Phone: 758-712-9678</p>
              <p>Email: ernell_sextius@hotmail.com</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2025 ESproductionz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


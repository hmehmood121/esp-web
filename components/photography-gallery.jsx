"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { MediaViewer } from "@/components/media-viewer"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export function PhotographyGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "photography"))
        const imagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          url: doc.data().imageUrl,
          fileName: doc.data().fileName,
          timestamp: doc.data().timestamp,
          ...doc.data(),
        }))
        setImages(imagesData)
      } catch (error) {
        console.error("Error fetching images:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const openViewer = (index) => {
    setSelectedIndex(index)
    setViewerOpen(true)
  }

  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 w-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-sm hover:shadow-md relative"
            onClick={() => openViewer(index)}
          >
            {/* Optional loading state indicator */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="transform scale-0 group-hover:scale-100 transition-transform">
                <span className="sr-only">View image</span>
              </div>
            </div>

            {/* Image container */}
            <div className="relative w-full h-full">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.fileName || `Image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                className="object-cover"
                priority={index < 6} // Load the first 6 images with priority
                quality={80}
              />
            </div>
          </div>
        ))}
      </div>

      <MediaViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        items={images}
        initialIndex={selectedIndex}
        type="image"
      />
    </>
  )
}

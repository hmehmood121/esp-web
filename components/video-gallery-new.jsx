"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { MediaViewer } from "@/components/media-viewer"
import { Loader2, Play } from "lucide-react"

export function VideoGalleryNew() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "videos"))
        const videosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          url: doc.data().videoUrl,
          fileName: doc.data().fileName,
          timestamp: doc.data().timestamp,
          thumbnailUrl: doc.data().thumbnailUrl,
          ...doc.data(),
        }))
        setVideos(videosData)
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
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

  if (videos.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">No videos available</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 w-full">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-sm hover:shadow-md relative"
            onClick={() => openViewer(index)}
          >
            {/* Thumbnail or first frame */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.fileName || `Video ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <MediaViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        items={videos}
        initialIndex={selectedIndex}
        type="video"
      />
    </>
  )
}

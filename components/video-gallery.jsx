"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { Video } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function VideoGallery() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"))
        const videosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
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

  if (loading) {
    return <div className="col-span-full text-center">Loading videos...</div>
  }

  if (videos.length === 0) {
    return <div className="col-span-full text-center">No videos available</div>
  }

  return (
    <>
      {videos.map((video) => (
        <Dialog key={video.id}>
          <DialogTrigger asChild>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-12 h-12 text-gray-500" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm truncate">Watch Video</p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Video Preview</DialogTitle>
              <DialogDescription>Watch the full video</DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full">
              <iframe
                src={video.link}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
}


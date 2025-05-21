"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Share, X } from "lucide-react"

export function MediaViewer({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
  type = "image", // "image" or "video"
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const currentItem = items[currentIndex]

  // Reset current index when items change
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, items])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
        case "Escape":
          onClose()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, items.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const handleDownload = () => {
    if (!currentItem) return

    const link = document.createElement("a")
    link.href = currentItem.url
    link.download = currentItem.fileName || `download-${currentIndex}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (!currentItem || !navigator.share) return

    try {
      await navigator.share({
        title: currentItem.fileName || "Shared media",
        text: "Check out this media from ESproductionz",
        url: currentItem.url,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  if (!isOpen || items.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] p-0 bg-black/95 backdrop-blur-md border-none overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Media container */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            {type === "image" ? (
              <img
                src={currentItem?.url || "/placeholder.svg"}
                alt={currentItem?.fileName || `Image ${currentIndex + 1}`}
                className="max-h-[65vh] max-w-full object-contain"
              />
            ) : (
              <video src={currentItem?.url} controls className="max-h-[65vh] max-w-full" controlsList="nodownload">
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Navigation and controls */}
          <div className="p-6 bg-black/50 flex justify-between items-center">
            <div className="text-white">
              {currentIndex + 1} / {items.length}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" size="sm" onClick={handleDownload} className="h-10 px-4">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {navigator.share && (
                <Button variant="outline" size="sm" onClick={handleShare} className="h-10 px-4">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>

          {/* Previous/Next buttons */}
          {items.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

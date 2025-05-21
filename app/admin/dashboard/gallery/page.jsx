"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Loader2, Upload, Video, Trash2, Play } from "lucide-react"
import { db } from "@/firebase"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { generateVideoThumbnail } from "@/lib/generate-thumbnail"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function GalleryUpload() {
  const [category, setCategory] = useState("")
  const [images, setImages] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])
  const [galleryImages, setGalleryImages] = useState({})
  const [galleryVideos, setGalleryVideos] = useState([])


  // Fetch existing images and videos on component mount
  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const fetchGalleryItems = async () => {
    try {
      // Fetch images
      const imagesSnapshot = await getDocs(collection(db, "images"))
      const imagesData = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Group images by category
      const groupedImages = imagesData.reduce((acc, img) => {
        if (!acc[img.category]) {
          acc[img.category] = []
        }
        acc[img.category].push(img)
        return acc
      }, {})
      setGalleryImages(groupedImages)

      // Fetch videos
      const videosSnapshot = await getDocs(collection(db, "videos"))
      const videosData = videosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setGalleryVideos(videosData)
    } catch (error) {
      console.error("Error fetching gallery items:", error)
      toast.error("Failed to fetch gallery items. Please try again.")
    }
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    if (!category || images.length === 0) {
      toast.error( "Please enter a category name and select images")
      setIsUploading(false)
      return
    }

    const storage = getStorage()
    const categoryRef = ref(storage, `categories/${category}`)

    try {
      for (const image of images) {
        const imageRef = ref(categoryRef, `${Date.now()}-${image.name}`)
        await uploadBytes(imageRef, image)
        const downloadURL = await getDownloadURL(imageRef)

        await addDoc(collection(db, "images"), {
          category,
          imageUrl: downloadURL,
          timestamp: new Date().toISOString(),
          fileName: image.name,
          storagePath: imageRef.fullPath,
        })
      }

      toast.success("Images uploaded successfully!")
      setCategory("")
      setImages([])
      setPreviewUrls([])
      fetchGalleryItems()
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Error uploading images. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const uploadVideo = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    if (!videoFile) {
      toast.error("Please select a video file to upload")
      setIsUploading(false)
      return
    }

    try {
      const storage = getStorage()
      const videoId = uuidv4()
      const videoRef = ref(storage, `videos/${videoId}-${videoFile.name}`)

      // Upload video file
      await uploadBytes(videoRef, videoFile)
      const videoUrl = await getDownloadURL(videoRef)

      // Generate thumbnail
      let thumbnailUrl = "/placeholder.svg"
      try {
        const thumbnailDataUrl = await generateVideoThumbnail(videoFile)

        // Convert data URL to blob
        const response = await fetch(thumbnailDataUrl)
        const blob = await response.blob()

        // Upload thumbnail to storage
        const thumbnailRef = ref(storage, `videos/thumbnails/${videoId}-thumbnail.jpg`)
        await uploadBytes(thumbnailRef, blob)
        thumbnailUrl = await getDownloadURL(thumbnailRef)
      } catch (thumbnailError) {
        console.error("Error generating thumbnail:", thumbnailError)
        // Continue with placeholder thumbnail
      }

      // Add to Firestore
      await addDoc(collection(db, "videos"), {
        videoUrl,
        thumbnailUrl,
        fileName: videoFile.name,
        storagePath: videoRef.fullPath,
        timestamp: new Date().toISOString(),
      })

      toast.success("Video uploaded successfully!")

      setVideoFile(null)
      setVideoPreview(null)
      fetchGalleryItems()
    } catch (error) {
      console.error("Error uploading video:", error)
      toast.error("Error uploading video. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const deleteImage = async (imageId, storagePath) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "images", imageId))

      // Delete from Storage
      const storage = getStorage()
      const imageRef = ref(storage, storagePath)
      await deleteObject(imageRef)

      toast.success( "Image deleted successfully")
      fetchGalleryItems()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Error deleting image. Please try again.")
    }
  }

  const deleteVideo = async (videoId, storagePath) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "videos", videoId))

      // Delete from Storage if path exists
      if (storagePath) {
        const storage = getStorage()
        const videoRef = ref(storage, storagePath)
        await deleteObject(videoRef)
      }

      toast.success("Video deleted successfully")
      fetchGalleryItems()
    } catch (error) {
      console.error("Error deleting video:", error)
      toast.error( "Error deleting video. Please try again.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Tabs defaultValue="images" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">Category Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <div className="space-y-6">
            {/* Upload Form */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Upload Category Images</CardTitle>
                <CardDescription>Enter a category name and select multiple images to upload</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category Name</Label>
                    <Input
                      id="category"
                      type="text"
                      value={category}
                      onChange={handleCategoryChange}
                      placeholder="Enter category name"
                      required
                      className="border-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Select Images</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                      className="border-2"
                    />
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Images Preview</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2 border-2 rounded-lg">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {images.length} {images.length === 1 ? "image" : "images"} selected
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isUploading || !category || images.length === 0}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Images
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Display Categories and Images */}
            {Object.entries(galleryImages).map(([categoryName, categoryImages]) => (
              <Card key={categoryName}>
                <CardHeader>
                  <CardTitle>{categoryName}</CardTitle>
                  <CardDescription>
                    {categoryImages.length} {categoryImages.length === 1 ? "image" : "images"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <Dialog>
                          <DialogTrigger asChild>
                            <img
                              src={image.imageUrl || "/placeholder.svg"}
                              alt={image.fileName}
                              className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                            />
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{image.fileName}</DialogTitle>
                              <DialogDescription>
                                Uploaded on {new Date(image.timestamp).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <img
                              src={image.imageUrl || "/placeholder.svg"}
                              alt={image.fileName}
                              className="w-full h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => deleteImage(image.id, image.storagePath)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="space-y-6">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Video</CardTitle>
                <CardDescription>Upload video files (MP4, WebM, etc.)</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={uploadVideo} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="video-file">Video File</Label>
                    <Input
                      id="video-file"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      required
                      className="border-2"
                    />
                  </div>

                  {videoPreview && (
                    <div className="space-y-2">
                      <Label>Video Preview</Label>
                      <div className="aspect-video w-full rounded-lg overflow-hidden border-2">
                        <video src={videoPreview} controls className="w-full h-full">
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={!videoFile || isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Display Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Videos</CardTitle>
                <CardDescription>Manage your videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryVideos.map((video) => (
                    <div key={video.id} className="relative group">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition relative">
                            {/* Thumbnail or placeholder */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                            <img
                              src={video.thumbnailUrl || "/placeholder.svg"}
                              alt={video.fileName || "Video"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{video.fileName || "Video"}</DialogTitle>
                            <DialogDescription>
                              Uploaded on {new Date(video.timestamp).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="aspect-video w-full">
                            <video src={video.videoUrl} controls className="w-full h-full">
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => deleteVideo(video.id, video.storagePath)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {galleryVideos.length === 0 && (
                  <div className="text-center py-8">
                    <Video className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">No videos uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Loader2, Upload, Video, Trash2 } from "lucide-react"
import { db } from "@/firebase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [videoUrl, setVideoUrl] = useState("")
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
      const videosSnapshot = await getDocs(collection(db, "portfolio"))
      const videosData = videosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setGalleryVideos(videosData)
    } catch (error) {
      console.error("Error fetching gallery items:", error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    if (!category || images.length === 0) {
      alert("Please enter a category name and select images")
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

      alert("Images uploaded successfully!")
      setCategory("")
      setImages([])
      setPreviewUrls([])
      fetchGalleryItems()
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Error uploading images. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const uploadVideo = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      await addDoc(collection(db, "portfolio"), {
        portfolio: videoUrl,
        timestamp: new Date().toISOString(),
      })
      alert("Video link added successfully")
      setVideoUrl("")
      fetchGalleryItems()
    } catch (error) {
      console.error("Error adding video:", error)
      alert("Error adding video")
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

      alert("Image deleted successfully")
      fetchGalleryItems()
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Error deleting image")
    }
  }

  const deleteVideo = async (videoId) => {
    try {
      await deleteDoc(doc(db, "portfolio", videoId))
      alert("Video link deleted successfully")
      fetchGalleryItems()
    } catch (error) {
      console.error("Error deleting video:", error)
      alert("Error deleting video")
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
                <CardTitle>Add Video Link</CardTitle>
                <CardDescription>Add YouTube or other video platform links</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={uploadVideo} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="video-url">Video URL</Label>
                    <Input
                      id="video-url"
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={!videoUrl || isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Add Video
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Display Videos */}
            <Card>
              <CardHeader>
                <CardTitle>Video Links</CardTitle>
                <CardDescription>Manage your video links</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {galleryVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <Video className="h-6 w-6" />
                          <a
                            href={video.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {video.portfolio}
                          </a>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => deleteVideo(video.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


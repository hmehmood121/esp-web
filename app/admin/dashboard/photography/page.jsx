"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Loader2, Upload, Trash2 } from "lucide-react"
import { db } from "@/firebase"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function PhotographyPage() {
  const [images, setImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])
  const [galleryImages, setGalleryImages] = useState([])


  // Fetch existing images on component mount
  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      // Fetch images
      const imagesSnapshot = await getDocs(collection(db, "photography"))
      const imagesData = imagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setGalleryImages(imagesData)
    } catch (error) {
      console.error("Error fetching gallery images:", error)
      toast.error("Failed to fetch images. Please try again.")
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image to upload")
      setIsUploading(false)
      return
    }

    const storage = getStorage()
    const uploadPromises = []

    try {
      for (const file of selectedFiles) {
        const fileId = uuidv4()
        const imageRef = ref(storage, `photography/${fileId}-${file.name}`)

        // Upload the file
        const uploadTask = uploadBytes(imageRef, file)
          .then(() => getDownloadURL(imageRef))
          .then((downloadURL) => {
            // Add to Firestore
            return addDoc(collection(db, "photography"), {
              imageUrl: downloadURL,
              fileName: file.name,
              storagePath: imageRef.fullPath,
              timestamp: new Date().toISOString(),
            })
          })

        uploadPromises.push(uploadTask)
      }

      await Promise.all(uploadPromises)

      toast.success(`${selectedFiles.length} images uploaded successfully!`)

      setSelectedFiles([])
      setPreviewUrls([])
      fetchGalleryImages()
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const deleteImage = async (imageId, storagePath) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "photography", imageId))

      // Delete from Storage
      const storage = getStorage()
      const imageRef = ref(storage, storagePath)
      await deleteObject(imageRef)

      toast.success( "Image deleted successfully")

      fetchGalleryImages()
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to delete image. Please try again.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Photography Images</CardTitle>
          <CardDescription>Select multiple images to upload to your photography gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="images">Select Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                className="border-2"
              />
            </div>

            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Images Preview</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 border-2 rounded-lg">
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
                  {selectedFiles.length} {selectedFiles.length === 1 ? "image" : "images"} selected
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isUploading || selectedFiles.length === 0}>
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

      {/* Display Images */}
      <Card>
        <CardHeader>
          <CardTitle>Photography Gallery</CardTitle>
          <CardDescription>
            {galleryImages.length} {galleryImages.length === 1 ? "image" : "images"} in your gallery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
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
                    <img src={image.imageUrl || "/placeholder.svg"} alt={image.fileName} className="w-full h-auto" />
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
    </div>
  )
}


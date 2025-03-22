"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { Loader2, Upload, Trash2 } from "lucide-react"
import { db } from "@/firebase"
import { v4 } from "uuid"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function PartnersPage() {
  const [partnerLogos, setPartnerLogos] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  useEffect(() => {
    fetchPartnerLogos()
  }, [])

  const fetchPartnerLogos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "partners"))
      const logosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPartnerLogos(logosData)
    } catch (error) {
      console.error("Error fetching partner logos:", error)
      toast.error("Failed to fetch partner logos. Please try again.")
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
      toast.error("Please select at least one logo to upload")
      setIsUploading(false)
      return
    }

    const storage = getStorage()
    const uploadPromises = []

    try {
      for (const file of selectedFiles) {
        const fileId = v4()
        const imageRef = ref(storage, `partners/${fileId}-${file.name}`)

        // Upload the file
        const uploadTask = uploadBytes(imageRef, file)
          .then(() => getDownloadURL(imageRef))
          .then((downloadURL) => {
            // Add to Firestore
            return addDoc(collection(db, "partners"), {
              imageUrl: downloadURL,
              storagePath: imageRef.fullPath,
              timestamp: new Date().toISOString(),
            })
          })

        uploadPromises.push(uploadTask)
      }

      await Promise.all(uploadPromises)

      toast.success(`${selectedFiles.length} partner logos uploaded successfully!`)

      setSelectedFiles([])
      setPreviewUrls([])
      fetchPartnerLogos()
    } catch (error) {
      console.error("Error uploading logos:", error)
      toast.error("Failed to upload logos. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (logo) => {
    if (!window.confirm("Are you sure you want to delete this partner logo?")) return

    try {
      await deleteDoc(doc(db, "partners", logo.id))

      // Delete image from storage if it exists
      if (logo.imageUrl) {
        const storage = getStorage()
        try {
          const imageRef = ref(storage, logo.storagePath)
          await deleteObject(imageRef)
        } catch (error) {
          console.error("Error deleting image:", error)
          // Continue with the logo deletion even if image deletion fails
        }
      }

      toast.success("Partner logo deleted successfully")
      fetchPartnerLogos()
    } catch (error) {
      console.error("Error deleting partner logo:", error)
      toast.error("Failed to delete partner logo. Please try again.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Partner Logos</CardTitle>
          <CardDescription>Add multiple partner or sponsor logos to your website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logos">Partner Logos *</Label>
              <Input id="logos" type="file" accept="image/*" multiple onChange={handleFileChange} required />
              <p className="text-sm text-muted-foreground">
                Upload partner logos (PNG or JPG recommended, transparent background preferred)
              </p>
            </div>

            {previewUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Logos Preview</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2 border-2 rounded-lg">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="aspect-square relative rounded-lg overflow-hidden border p-2 flex items-center justify-center"
                    >
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length} {selectedFiles.length === 1 ? "logo" : "logos"} selected
                </p>
              </div>
            )}

            <Button type="submit" disabled={isUploading || selectedFiles.length === 0}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logos
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partner Logos</CardTitle>
          <CardDescription>Manage your partner and sponsor logos</CardDescription>
        </CardHeader>
        <CardContent>
          {partnerLogos.length === 0 ? (
            <div className="text-center py-6">
              <p className="mt-4 text-lg font-medium">No partner logos yet</p>
              <p className="text-sm text-muted-foreground">Add your first partner logo using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partnerLogos.map((logo) => (
                <div key={logo.id} className="relative group">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="aspect-square border rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <img
                          src={logo.imageUrl || "/placeholder.svg"}
                          alt="Partner logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Partner Logo</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center justify-center p-4">
                        <img
                          src={logo.imageUrl || "/placeholder.svg"}
                          alt="Partner logo"
                          className="max-w-full max-h-[60vh] object-contain"
                        />
                      </div>
                      <Button variant="destructive" className="w-full" onClick={() => handleDelete(logo)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Logo
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => handleDelete(logo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Loader2, Upload, Pencil, Trash2, X, Quote } from "lucide-react"
import { db } from "@/firebase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editTestimonial, setEditTestimonial] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    image: null,
    imageUrl: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const snapshot = await getDocs(collection(db, "testimonials"))
      const testimonialsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTestimonials(testimonialsData)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      alert("Error fetching testimonials")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = formData.imageUrl
      if (formData.image) {
        const storage = getStorage()
        const imageRef = ref(storage, `testimonials/${Date.now()}-${formData.image.name}`)
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      if (editTestimonial) {
        // Update existing testimonial
        await updateDoc(doc(db, "testimonials", editTestimonial.id), {
          name: formData.name,
          designation: formData.designation,
          review: formData.review,
          imageUrl: imageUrl,
        })
      } else {
        // Add new testimonial
        await addDoc(collection(db, "testimonials"), {
          name: formData.name,
          designation: formData.designation,
          review: formData.review,
          imageUrl: imageUrl,
          timestamp: new Date().toISOString(),
        })
      }

      alert(editTestimonial ? "Testimonial updated successfully!" : "Testimonial added successfully!")
      resetForm()
      fetchTestimonials()
    } catch (error) {
      console.error("Error saving testimonial:", error)
      alert("Error saving testimonial")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (testimonial) => {
    setEditTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation,
      review: testimonial.review,
      imageUrl: testimonial.imageUrl,
      image: null,
    })
  }

  const handleDelete = async (testimonial) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return

    try {
      await deleteDoc(doc(db, "testimonials", testimonial.id))

      // Delete image from storage if it exists
      if (testimonial.imageUrl) {
        const storage = getStorage()
        const imageRef = ref(storage, testimonial.imageUrl)
        await deleteObject(imageRef).catch((error) => console.error("Error deleting image:", error))
      }

      alert("Testimonial deleted successfully")
      fetchTestimonials()
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      alert("Error deleting testimonial")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      review: "",
      image: null,
      imageUrl: "",
    })
    setEditTestimonial(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editTestimonial ? "Edit Testimonial" : "Add Testimonial"}</CardTitle>
          <CardDescription>
            {editTestimonial ? "Update testimonial information" : "Add a new testimonial to your website"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Review *</Label>
              <Textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image *</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required={!editTestimonial} />
            </div>

            {(formData.imagePreview || formData.imageUrl) && (
              <div className="w-32 h-32 relative">
                <img
                  src={formData.imagePreview || formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editTestimonial ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {editTestimonial ? "Update Testimonial" : "Add Testimonial"}
                  </>
                )}
              </Button>
              {editTestimonial && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Manage your testimonials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative rounded-full overflow-hidden">
                        <img
                          src={testimonial.imageUrl || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <Quote className="absolute top-0 left-0 h-6 w-6 text-muted-foreground/20" />
                      <p className="pl-8 text-sm text-muted-foreground">{testimonial.review}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


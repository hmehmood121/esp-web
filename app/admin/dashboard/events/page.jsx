"use client"

import { useState, useEffect } from "react"
import { collection, doc, addDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { v4 } from "uuid"
import { storage, db } from "@/firebase"
import { Calendar, MapPin, Clock, Loader2, Upload, Trash2, Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getStorage } from "firebase/storage"

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    image: null,
    imageUrl: "",
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"))
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setEvents(eventsData)
    } catch (error) {
      console.error("Error fetching events:", error)
      alert("Error fetching events")
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
    setIsUploading(true)

    try {
      let imageUrl = formData.imageUrl
      if (formData.image) {
        const imageRef = ref(storage, `eventImages/${formData.image.name + v4()}`)
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        imageUrl: imageUrl,
        timestamp: new Date().toISOString(),
      }

      if (editEvent) {
        await updateDoc(doc(db, "events", editEvent.id), eventData)
        alert("Event updated successfully")
      } else {
        await addDoc(collection(db, "events"), eventData)
        alert("Event added successfully")
      }

      resetForm()
      fetchEvents()
    } catch (error) {
      console.error("Error saving event:", error)
      alert("Error saving event")
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (event) => {
    setEditEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      imageUrl: event.imageUrl,
      image: null,
    })
  }

  const handleDelete = async (event) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      await deleteDoc(doc(db, "events", event.id))

      // Delete image from storage if it exists
      if (event.imageUrl) {
        const storage = getStorage()
        const imageRef = ref(storage, event.imageUrl)
        await deleteObject(imageRef).catch((error) => console.error("Error deleting image:", error))
      }

      alert("Event deleted successfully")
      fetchEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Error deleting event")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      image: null,
      imageUrl: "",
    })
    setEditEvent(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editEvent ? "Edit Event" : "Add New Event"}</CardTitle>
          <CardDescription>
            {editEvent ? "Update event information" : "Create a new event with details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required={!editEvent} />
            </div>

            {(formData.imagePreview || formData.imageUrl) && (
              <div className="w-full max-w-md aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={formData.imagePreview || formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editEvent ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {editEvent ? "Update Event" : "Create Event"}
                  </>
                )}
              </Button>
              {editEvent && (
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
          <CardTitle>Events</CardTitle>
          <CardDescription>Manage your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <img
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate && (
                          <>
                            <Clock className="h-4 w-4 mx-1" />
                            {new Date(event.endDate).toLocaleDateString()}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event)}>
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


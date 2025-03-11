"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Loader2, Pencil, Trash2, X, Bell } from "lucide-react"
import { db } from "@/firebase"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editNotification, setEditNotification] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imageUrl: "",
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const snapshot = await getDocs(collection(db, "notifications"))
      const notificationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch notifications. Please try again.",
      })
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
        const imageRef = ref(storage, `notifications/${uuidv4()}-${formData.image.name}`)
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      const notificationData = {
        title: formData.title,
        description: formData.description,
        imageUrl: imageUrl || "",
        timestamp: new Date().toISOString(),
      }

      if (editNotification) {
        // Update existing notification
        await updateDoc(doc(db, "notifications", editNotification.id), notificationData)
        toast.success("Notification updated successfully!")
      } else {
        // Add new notification
        await addDoc(collection(db, "notifications"), notificationData)
        toast.success("Notification added successfully!")
      }

      resetForm()
      fetchNotifications()
    } catch (error) {
      console.error("Error saving notification:", error)
      toast.error("Failed to save notification. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (notification) => {
    setEditNotification(notification)
    setFormData({
      title: notification.title,
      description: notification.description,
      imageUrl: notification.imageUrl || "",
      image: null,
    })
  }

  const handleDelete = async (notification) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return

    try {
      await deleteDoc(doc(db, "notifications", notification.id))

      // Delete image from storage if it exists
      if (notification.imageUrl) {
        const storage = getStorage()
        try {
          const imageRef = ref(storage, notification.imageUrl)
          await deleteObject(imageRef)
        } catch (error) {
          console.error("Error deleting image:", error)
          // Continue with the notification deletion even if image deletion fails
        }
      }

      toast.success("Notification deleted successfully")
      fetchNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
      imageUrl: "",
    })
    setEditNotification(null)
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editNotification ? "Edit Notification" : "Add Notification"}</CardTitle>
          <CardDescription>
            {editNotification ? "Update notification details" : "Create a new notification to display on your website"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Notification title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                placeholder="Notification details"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              <p className="text-sm text-muted-foreground">Upload an image to accompany this notification (optional)</p>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editNotification ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    {editNotification ? "Update Notification" : "Create Notification"}
                  </>
                )}
              </Button>
              {editNotification && (
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">Create your first notification using the form above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notifications.map((notification) => (
                <Card key={notification.id} className="overflow-hidden">
                  {notification.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={notification.imageUrl || "/placeholder.svg"}
                        alt={notification.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(notification.timestamp)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(notification)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(notification)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


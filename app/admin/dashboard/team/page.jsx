"use client"

import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { Loader2, Upload, Pencil, Trash2, X } from "lucide-react"
import { db } from "@/firebase"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeamPage() {
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    about: "",
    image: null,
    imageUrl: "",
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "team"))
      const teamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMembers(teamData)
    } catch (error) {
      console.error("Error fetching team members:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch team members. Please try again.",
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
        const imageRef = ref(storage, `team/${Date.now()}-${formData.image.name}`)
        await uploadBytes(imageRef, formData.image)
        imageUrl = await getDownloadURL(imageRef)
      }

      if (editMember) {
        // Update existing member
        await updateDoc(doc(db, "team", editMember.id), {
          name: formData.name,
          designation: formData.designation,
          about: formData.about,
          imageUrl: imageUrl,
        })
        toast({
          variant: "success",
          title: "Success",
          description: "Team member updated successfully!",
        })
      } else {
        // Add new member
        await addDoc(collection(db, "team"), {
          name: formData.name,
          designation: formData.designation,
          about: formData.about,
          imageUrl: imageUrl,
          timestamp: new Date().toISOString(),
        })
        toast({
          variant: "success",
          title: "Success",
          description: "Team member added successfully!",
        })
      }

      resetForm()
      fetchTeamMembers()
    } catch (error) {
      console.error("Error saving team member:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save team member. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (member) => {
    setEditMember(member)
    setFormData({
      name: member.name,
      designation: member.designation,
      about: member.about || "",
      imageUrl: member.imageUrl,
      image: null,
    })
  }

  const handleDelete = async (member) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return

    try {
      await deleteDoc(doc(db, "team", member.id))

      // Delete image from storage if it exists
      if (member.imageUrl) {
        const storage = getStorage()
        const imageRef = ref(storage, member.imageUrl)
        await deleteObject(imageRef).catch((error) => console.error("Error deleting image:", error))
      }

      toast({
        variant: "success",
        title: "Success",
        description: "Team member deleted successfully",
      })
      fetchTeamMembers()
    } catch (error) {
      console.error("Error deleting team member:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team member. Please try again.",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      about: "",
      image: null,
      imageUrl: "",
    })
    setEditMember(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editMember ? "Edit Team Member" : "Add Team Member"}</CardTitle>
          <CardDescription>
            {editMember ? "Update team member information" : "Add a new team member to your website"}
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
              <Label htmlFor="about">About</Label>
              <Textarea id="about" name="about" value={formData.about} onChange={handleInputChange} rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image *</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required={!editMember} />
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
                    {editMember ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {editMember ? "Update Member" : "Add Member"}
                  </>
                )}
              </Button>
              {editMember && (
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
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <img
                        src={member.imageUrl || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.designation}</p>
                      {member.about && <p className="text-sm text-muted-foreground line-clamp-3">{member.about}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(member)}>
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


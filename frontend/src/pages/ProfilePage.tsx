import type React from "react"
import { useState, useEffect } from "react"
import { Spinner, Alert } from "react-bootstrap"
import AvatarSelectionModal from "../components/AvatarSelector"
import { updateProfilePhoto, fetchUserData } from "../api/Profile"

// Helper function to compress images
const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with reduced quality
        const dataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(dataUrl)
      }
      img.onerror = (error) => {
        reject(error)
      }
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      setError(null)

      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null")
        setUser(storedUser)

        if (storedUser && storedUser.id) {
          const userData = await fetchUserData(storedUser.id)

          // Update user data with additional info from API
          setUser((prev: any) => ({
            ...prev,
            school: userData.school,
            uniqueIdentifier: userData.uniqueIdentifier,
          }))

          if (userData.profilePhoto) {
            setProfilePhoto(userData.profilePhoto)
            localStorage.setItem("profilePhoto", userData.profilePhoto)
          } else {
            // Check if we have a profile photo in localStorage
            const storedPhoto = localStorage.getItem("profilePhoto")
            if (storedPhoto) {
              setProfilePhoto(storedPhoto)
            }
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err)
        setError("حدث خطأ أثناء تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى.")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الملف كبير جدًا. يرجى اختيار صورة أقل من 5 ميجابايت.")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("يرجى اختيار ملف صورة صالح.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Compress the image before uploading
      const compressedImage = await compressImage(file)

      if (user && user.id) {
        await updateProfilePhoto(user.id, compressedImage)
        setProfilePhoto(compressedImage)
        localStorage.setItem("profilePhoto", compressedImage)
        setUpdateSuccess(true)

        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Error updating profile photo:", err)
      setError("حدث خطأ أثناء تحديث صورة الملف الشخصي. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarSelection = async (avatarUrl: string) => {
    setLoading(true)
    setError(null)

    try {
      if (user && user.id) {
        await updateProfilePhoto(user.id, avatarUrl)
        setProfilePhoto(avatarUrl)
        localStorage.setItem("profilePhoto", avatarUrl)
        setUpdateSuccess(true)

        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000)
      }
    } catch (err) {
      console.error("Error updating profile photo:", err)
      setError("حدث خطأ أثناء تحديث صورة الملف الشخصي. يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="profile-container text-center">
      {error && <Alert variant="danger">{error}</Alert>}
      {updateSuccess && <Alert variant="success">تم تحديث صورة الملف الشخصي بنجاح!</Alert>}

      <div className="profile-picture position-relative mb-4">
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-75 rounded-circle">
            <Spinner animation="border" size="sm" />
          </div>
        )}
        <img
          src={profilePhoto || "/placeholder.svg?height=150&width=150"}
          alt="Profile"
          className="rounded-circle border"
          width="150"
          height="150"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="mb-4">
        <label className="btn btn-primary m-2">
          تحميل صورة
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            hidden
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
        <button className="btn btn-secondary m-2" onClick={() => setShowModal(true)} disabled={loading}>
          اختر صورة رمزية
        </button>
      </div>

      {user && (
        <div className="mt-4 text-center">
          <h3>
            <strong>الاسم:</strong> {user.name}
          </h3>
          <h3>
            <strong>المدرسة:</strong> {user.school || "غير محدد"}
          </h3>
          <h3>
            <strong>الدور:</strong> {user.role === "teacher" ? "معلم" : user.role === "student" ? "طالب" : "ولي أمر"}
          </h3>
          <h3>
            <strong>المعرف:</strong> {user.uniqueIdentifier || "غير محدد"}
          </h3>
        </div>
      )}

      {showModal && (
        <AvatarSelectionModal setProfilePhoto={handleAvatarSelection} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default ProfilePage


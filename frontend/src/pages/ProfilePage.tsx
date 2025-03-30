import type React from "react"
import { useState } from "react"
import { Alert } from "react-bootstrap"
import AvatarSelectionModal from "../components/AvatarSelector"
import { updateProfilePhoto } from "../api/auth"
import { useLocation } from "react-router-dom"
import default_avatar from "../assets/avatars/default.jpg"
const DEFAULT_AVATAR = default_avatar; // Default avatar

const ProfilePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  // Get user from location state or localStorage
  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null")

  // Set the profile photo to default avatar if not provided
  const [profilePhoto, setProfilePhoto] = useState<string>(user.profilePhoto || DEFAULT_AVATAR);
  console.log("🚀 ~ user.profilePhoto:", user.profilePhoto)

  const handleAvatarSelection = async (avatarUrl: string) => {
    try {
      await updateProfilePhoto(user.id, user.role, avatarUrl);
      
      // Update user object in localStorage
      const updatedUser = { ...user, profilePhoto: avatarUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the profile photo state
      setProfilePhoto(avatarUrl);
    } catch (err) {
      console.error("Error updating profile photo:", err);
      setError("حدث خطأ أثناء تحديث الصورة الرمزية.");
    }
  };

  return (
    <div className="profile-container text-center">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="profile-picture mb-4">
        <img src={profilePhoto} alt="Profile" className="rounded-circle border" width="150" height="150" />
      </div>

      <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
        اختر صورة رمزية
      </button>

      {user && (
        <div className="mt-4 text-center">
          <h3>
            <strong>الاسم:</strong> {user.name}
          </h3>
          <h3>
            <strong>المدرسة:</strong> {user.school || "غير محدد"}
          </h3>
          <h3>
            <strong>الدور:</strong> {user.role === "teacher" ? "معلم" : user.role === "student" ? "تلميذ" : "ولي أمر"}
          </h3>
          <h3>
            <strong>المعرف:</strong> {user.uniqueIdentifier || "غير محدد"}
          </h3>
        </div>
      )}

      {showModal && (
        <AvatarSelectionModal 
          setProfilePhoto={handleAvatarSelection} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default ProfilePage;

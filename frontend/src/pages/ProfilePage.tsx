import type React from "react"
import { useState } from "react"
import { Alert } from "react-bootstrap"
import AvatarSelectionModal from "../components/AvatarSelector"
import { updateAvatar } from "../api/auth"
import { Avatar } from "../assets/data/Avatar"
import { useUser } from "../assets/context/UserContext"

const ProfilePage: React.FC = () => {
  const { user, refreshUserData } = useUser(); // Use the context
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarSelection = async (avatar: Avatar) => {
    try {
      console.log("Selected avatar:", avatar); // Debug log
      await updateAvatar(user!.id, user!.role, avatar); // Pass the selected avatar object
      await refreshUserData(); // Refresh user data after updating the avatar
    } catch (err) {
      console.error("Error updating avatar:", err); // Debug log
      setError("حدث خطأ أثناء تحديث الصورة الرمزية.");
    }
  };

  return (
    <div className="profile-container text-center">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="profile-picture mb-4">
        <img
          src={user?.avatar.profile }
          alt="Profile"
          className="rounded-circle border"
          width="150"
          height="150"
        />
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
          setAvatar={handleAvatarSelection} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default ProfilePage;

import React from "react";
import avatar1 from "../assets/avatars/avatar1.jpg";
import avatar2 from "../assets/avatars/avatar2.jpg";
import avatar3 from "../assets/avatars/avatar3.jpg";
import avatar4 from "../assets/avatars/avatar4.jpg";
import avatar5 from "../assets/avatars/avatar5.jpg";
import avatar6 from "../assets/avatars/avatar6.jpg";
import avatar7 from "../assets/avatars/avatar7.jpg";
const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
];

interface AvatarSelectionModalProps {
  setProfilePhoto: (photo: string) => void;
  onClose: () => void;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({ setProfilePhoto, onClose }) => {
  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">اختر صورة رمزية</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body d-flex flex-wrap justify-content-center">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="m-2 rounded-circle"
                width="80"
                height="80"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setProfilePhoto(avatar);
                  localStorage.setItem("profilePhoto", avatar);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelectionModal;

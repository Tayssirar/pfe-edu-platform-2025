import React from "react";

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
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

// components/AvatarSelector.tsx

import React from "react";
import { avatars, Avatar } from "../assets/data/Avatar";

interface AvatarSelectionModalProps {
  setAvatar: (avatar: Avatar) => void;
  onClose: () => void;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({ setAvatar, onClose }) => {
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
                key={avatar.id}
                src={avatar.profile}
                alt={avatar.name}
                className="m-2 rounded-circle"
                width="80"
                height="80"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setAvatar(avatar);
                  localStorage.setItem("selectedAvatar", JSON.stringify(avatar));
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

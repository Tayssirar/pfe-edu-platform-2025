import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArabicDate from "../components/ArabicDate";
import { useUser } from "../assets/context/UserContext";

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, refreshUserData } = useUser(); // Use the context
  useEffect(() => {
    const fetchUserData = async () => {
      await refreshUserData(); // Refresh user data after updating the avatar
    
    };
    fetchUserData();
  }, []);


  const userName = user?.name || "";
  const userRole = user?.role || "";

  // Define navigation items based on user role
  const navOptions: Record<string, { label: string; path: string; state?: any }[]> = {
    teacher: [
      { label: "الصفحة الرئيسية", path: `/dashboard/${user?.id}/${userRole}`, state: { user }  },
      { label: "الملف الشخصي", path: `/teacher/${user?.id}/profile`, state: { user }  },
      { label: "الدروس", path: `/teacher/${user?.id}/lessons`, state: { user } },
      { label: "التلاميذ", path: `/teacher/${user?.id}/students`, state: { user }  }, 
    ],
    parent: [

      { label: "الملف الشخصي", path: `/parent/${user?.id}/profile`, state: { user } },
      { label: "أداء الطفل", path: `/dashboard/${user?.id}/${userRole}`, state: { user } },
    ],
    student: [
      { label: "الصفحة الرئيسية", path: `/dashboard/${user?.id}/${userRole}`, state: { user }  },
      { label: "الملف الشخصي", path: `/student/${user?.id}/profile`, state: { user } },
      { label: "الدروس", path: `/student/${user?.id}/lessons`, state: { user } },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    navigate("/"); 
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header with title */}
        <div className="page-header">
          <div className="page-welcome">
              <h3>مرحباً {userName}!</h3>
              <ArabicDate />
          </div>

          {/* Navigation Menu */}
          <div className="nav-buttons">
            {(navOptions[userRole] || []).map((item, index) => (
              <Link key={index} to={item.path} className={`nav-button ${location.pathname === item.path ? "active" : ""}`}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <div className="user-profile" ref={dropdownRef}>
            <div className="user-avatar" onClick={() => setShowLogout(!showLogout)}>
              <img src={user?.avatar.profile} alt="" />
            </div>
            {showLogout && (
              <div className="logout-popover">
                <button  className="logout-button" onClick={handleLogout}>تسجيل الخروج</button>
              </div>
            )}
          </div>


        </div>
        {children}

      </div>
    </div>
  );
};

export default PageLayout;

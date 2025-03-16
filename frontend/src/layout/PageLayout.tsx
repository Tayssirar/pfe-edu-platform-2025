import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArabicDate from "../components/ArabicDate";
import StudentsList from "../pages/teacher/StudentsList";

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user info from localStorage (replace with state management if needed)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  console.log("🚀 ~ user:", user);

  const userName = user?.name || "";
  const userRole = user?.role || "";
  const Role = user?.role === "teacher" ? "المعلم" : user?.role === "parent" ? "ولي أمر" : user?.role === "student" ? "طالب" : "";

  // Define navigation items based on user role
  const navOptions: Record<string, { label: string; path: string; state?: any }[]> = {
    teacher: [
      { label: "الملف الشخصي", path: `/teacher/${user.id}/profile`, state: { user }  },
      { label: "الدروس", path: `/teacher/${user.id}/lessons`, state: { user } },
      { label: "الطلاب", path: `/teacher/${user.id}/students`, state: { user }  }, 
    ],
    parent: [
      { label: "الملف الشخصي", path: `/parent/${user.id}/profile`, state: { user } },
      { label: "أداء الطفل", path: `/parent/${user.id}/kid-performance`, state: { user } },
    ],
    student: [
      { label: "الملف الشخصي", path: `/student/${user.id}/profile`, state: { user } },
      { label: "الدروس", path: `/student/${user.id}/lessons`, state: { user } },
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
    <div className="page-container" dir="rtl">
      <div className="page-content">
        {/* Header with title */}
        <div className="page-header">
          <div className="dropdown" ref={dropdownRef}>
            <div
              className="title-bubble dropdown-toggle"
              onClick={() => setShowLogout(!showLogout)}
            >
              <h1>فضاء {Role} </h1>
            </div>
            {showLogout && (
              <div className="dropdown-menu show">
                <button className="dropdown-item" onClick={handleLogout}>تسجيل الخروج</button>
              </div>
            )}
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
          <div className="user-profile">
            <div className="user-avatar">
              <img src="/placeholder.svg?height=40&width=40" alt="User" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-main">
          <div className="page-welcome">
            <h2>مرحباً {userName}!</h2>
            <ArabicDate />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;

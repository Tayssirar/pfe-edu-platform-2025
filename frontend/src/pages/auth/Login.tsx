import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../../api/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role");

  const [role, setRole] = useState<string>(roleFromQuery || "student");
  const [uniqueIdentifier, setUniqueIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [childId, setChildId] = useState<string>("");

  const handleLogin = async () => {
    try {
      let payload: any = { role }; // Ensure role is always passed
  
      if (role === "student" && uniqueIdentifier) {
        payload = { ...payload, uniqueIdentifier };
      } else if (role === "teacher" && uniqueIdentifier && password) {
        payload = { ...payload, uniqueIdentifier, password };
      } else if (role === "parent" && childId && password) {
        payload = { ...payload, uniqueIdentifier: childId, password };
      } else {
        alert("يرجى ملء الحقول المطلوبة");
        return;
      }
  
      console.log("🚀 ~ Sending login payload:", payload); // Debugging log
  
      const response = await login(payload);
  
      // Store role and user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", response.data.user.name);
  
      // Navigate to the correct dashboard
      navigate(`/dashboard/${response.data.user.id}/${role}`);
    } catch (error: any) {
      console.error("🚀 ~ handleLogin ~ error:", error);
      alert(error.response ? error.response.data.message : "An error occurred");
    }
  };

  // Map role to Arabic for display
  const getRoleInArabic = (roleValue: string): string => {
    switch (roleValue) {
      case "student":
        return "تلميذ";
      case "teacher":
        return "معلم";
      case "parent":
        return "ولي أمر";
      default:
        return roleValue;
    }
  };

  return (
    <div className="auth-container login-position">
      <h3 className="auth-header">تسجيل الدخول {roleFromQuery && `(${getRoleInArabic(role)})`}</h3>

      <form onSubmit={(e) => e.preventDefault()}>
        {role === "student" && (
          <div className="mb-3">
            <label htmlFor="uniqueIdentifier" className="form-label">
              المعرف الوحيد
            </label>
            <input
              type="text"
              id="uniqueIdentifier"
              className="form-control"
              value={uniqueIdentifier}
              onChange={(e) => setUniqueIdentifier(e.target.value)}
              placeholder="أدخل المعرف الوحيد الخاص بك"
              required
            />
          </div>
        )}

        {role === "teacher" && (
          <>
            <div className="mb-3">
              <label htmlFor="uniqueIdentifier" className="form-label">
                المعرف الوحيد
              </label>
              <input
                type="text"
                id="uniqueIdentifier"
                className="form-control"
                value={uniqueIdentifier}
                onChange={(e) => setUniqueIdentifier(e.target.value)}
                placeholder="أدخل المعرف الوحيد الخاص بك"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                كلمة السر
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة السر"
                required
              />
            </div>
          </>
        )}

        {role === "parent" && (
          <>
            <div className="mb-3">
              <label htmlFor="childId" className="form-label">
                المعرف الوحيد للطفل
              </label>
              <input
                type="text"
                id="childId"
                className="form-control"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                placeholder="أدخل المعرف الوحيد للطفل"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                كلمة السر
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة السر"
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary submit-button" onClick={handleLogin}>
          تسجيل الدخول
        </button>
      </form>

      <div className="text-center register-link">
        <p>
          ليس لديك حساب؟ <Link to={`/register?role=${role}`}>سجل الآن</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
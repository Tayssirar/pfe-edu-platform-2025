import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { register } from "../../api/auth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role");

  // State to handle form data
  const [formData, setFormData] = useState({
    role: roleFromQuery || "teacher",
    parentName: "",
    childName: "",
    uniqueIdentifier: "",
    school: "",
    password: "",
    confirmPassword: "",
    teacherName: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Function to handle role change and update URL
  const handleRegister = async () => {
    const { role, parentName, childName, uniqueIdentifier, school, password, confirmPassword, teacherName } = formData;

    if (password !== confirmPassword) {
      alert("كلمات السر غير متطابقة");
      return;
    }

    const requiredFields =
      role === "parent"
        ? [parentName, childName, uniqueIdentifier, school, password]
        : [teacherName, uniqueIdentifier, school, password];

    if (requiredFields.some((field) => !field)) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const payload = {
        role,
        userId: uniqueIdentifier,
        password,
        parentName: role === "parent" ? parentName : undefined,
        childName: role === "parent" ? childName : undefined,
        teacherName: role === "teacher" ? teacherName : undefined,
        school,
        uniqueIdentifier,
      };

      const response = await register(payload);
      if (response.status === 201) {
        navigate(`/login?role=${role}`);
      }
    } catch (error: any) {
      alert(error.response ? error.response.data.message : "An error occurred");
    }
  };

  return (
    <div className="auth-container register-position">
      <h3 className="auth-header">
        إنشاء حساب جديد {roleFromQuery && (roleFromQuery === "teacher" ? " (معلم)" : " (ولي أمر)")}
      </h3>

      <form onSubmit={(e) => e.preventDefault()}>
        {formData.role === "parent" && (
          <div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="parentName" className="form-label">
                  اسم ولي الأمر
                </label>
                <input
                  type="text"
                  id="parentName"
                  className="form-control"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="أدخل اسم ولي الأمر"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="childName" className="form-label">
                  اسم الطفل
                </label>
                <input
                  type="text"
                  id="childName"
                  className="form-control"
                  value={formData.childName}
                  onChange={handleChange}
                  placeholder="أدخل اسم الطفل"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {formData.role === "teacher" && (
          <div>
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="teacherName" className="form-label">
                  اسم المعلم
                </label>
                <input
                  type="text"
                  id="teacherName"
                  className="form-control"
                  value={formData.teacherName}
                  onChange={handleChange}
                  placeholder="أدخل اسم المعلم"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="uniqueIdentifier" className="form-label">
              المعرف الوحيد
            </label>
            <input
              type="text"
              id="uniqueIdentifier"
              className="form-control"
              value={formData.uniqueIdentifier}
              onChange={handleChange}
              placeholder="أدخل المعرف الوحيد"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="school" className="form-label">
              المدرسة
            </label>
            <input
              type="text"
              id="school"
              className="form-control"
              value={formData.school}
              onChange={handleChange}
              placeholder="أدخل اسم المدرسة"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              كلمة السر
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="أدخل كلمة السر"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">
              تأكيد كلمة السر
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="أدخل كلمة السر مرة أخرى"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary submit-button" onClick={handleRegister}>
          تسجيل
        </button>
      </form>

      <div className="text-center register-link">
        <p>
          لديك حساب بالفعل؟ <Link to={`/login?role=${formData.role}`}>تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

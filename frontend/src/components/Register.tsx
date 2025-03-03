import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import { lottieOptions } from "../lottieConfig";
import birdTired from "../assets/bird-tired.json";
import { register } from "../api/auth";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    role: "teacher",
    parentName: "",
    childName: "",
    uniqueIdentifier: "",
    school: "",
    grades: [] as string[],
    password: "",
    confirmPassword: "",
    teacherName: ""
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const { checked } = e.target;
      setFormData((prevData) => {
        const newGrades = checked
          ? [...prevData.grades, value]
          : prevData.grades.filter((grade) => grade !== value);
        return { ...prevData, grades: newGrades };
      });
    } else if (e.target instanceof HTMLInputElement && e.target.type === "radio") {
      setFormData((prevData) => ({ ...prevData, grades: [value] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  const handleRegister = async () => {
    const {
      role,
      parentName,
      childName,
      uniqueIdentifier,
      school,
      grades,
      password,
      confirmPassword,
      teacherName
    } = formData;

    if (password !== confirmPassword) {
      alert("كلمات السر غير متطابقة");
      return;
    }

    const requiredFields =
      role === "parent"
        ? [parentName, childName, uniqueIdentifier, school, grades[0], password]
        : [teacherName, uniqueIdentifier, school, grades, password];

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
        grades,
        uniqueIdentifier,
      };

      const response = await register(payload);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error: any) {
      alert(error.response ? error.response.data.message : "An error occurred");
    }
  };

  return (
    <div className="container-fluid bg-warning min-vh-100 d-flex justify-content-center align-items-center" dir="rtl">
      <div className="col-md-4 d-flex justify-content-center align-items-center">
        <div className="p-5">
          <Lottie options={lottieOptions(birdTired)} height={300} width={400} />
          <p className="text-center mt-3">مرحباً بك! قم بالتسجيل لبدء اللعب.</p>
        </div>
      </div>

      <div className="col-md-8 col-lg-4 bg-white p-3 rounded shadow-lg">
        <h3 className="text-center mb-4">إنشاء حساب جديد</h3>

        <div className="d-flex justify-content-around mb-4">
          {["teacher", "parent"].map((roleOption) => (
            <button
              key={roleOption}
              className={`btn ${
                formData.role === roleOption ? "btn-success" : "btn-outline-primary"
              } w-25`}
              onClick={() =>
                setFormData((prevData) => ({ ...prevData, role: roleOption }))
              }
            >
              {roleOption === "teacher" ? "معلم" : "ولي أمر"}
            </button>
          ))}
        </div>

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

              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">السنة الدراسي</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="grade1"
                      name="grade"
                      value="1"
                      checked={formData.grades.includes("1")}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label htmlFor="grade1" className="form-check-label">
                      السنة 1
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      id="grade2"
                      name="grade"
                      value="2"
                      checked={formData.grades.includes("2")}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label htmlFor="grade2" className="form-check-label">
                      السنة 2
                    </label>
                  </div>
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

              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">السنة الدراسي</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="grade1"
                      name="grades"
                      value="1"
                      checked={formData.grades.includes("1")}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label htmlFor="grade1" className="form-check-label">
                      السنة 1
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="grade2"
                      name="grades"
                      value="2"
                      checked={formData.grades.includes("2")}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label htmlFor="grade2" className="form-check-label">
                      السنة 2
                    </label>
                  </div>
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

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            onClick={handleRegister}
          >
            تسجيل
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            لديك حساب بالفعل؟ <a href="/login">تسجيل الدخول</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
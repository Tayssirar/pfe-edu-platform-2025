import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import birdSayHi from "../assets/bird-say-hi.json";
import { lottieOptions } from "../lottieConfig";
import { login } from "../api/auth";

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<string>("student");
  const [uniqueIdentifier, setUniqueIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [childId, setChildId] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      let payload: any = { role };

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

      const response = await login(payload);
      // Backend returns a `dashboard` URL on success
      if (response.data.dashboard) {
        navigate(response.data.dashboard);
      }
    } catch (error: any) {
      alert(error.response ? error.response.data.message : "An error occurred");
    }
  };

  return (
    <div className="container-fluid bg-warning min-vh-100 d-flex justify-content-center align-items-center" dir="rtl">
      <div className="col-md-3 d-flex justify-content-center align-items-center">
        <div className="p-4">
          <Lottie options={lottieOptions(birdSayHi)} height={200} width={200} />
          <p className="text-center mt-3">مرحباً بك! قم بتسجيل الدخول لبدء اللعب.</p>
        </div>
      </div>

      <div className="col-md-6 col-lg-4 bg-white p-5 rounded shadow-lg">
        <h3 className="text-center mb-4">تسجيل الدخول</h3>

        <div className="d-flex justify-content-around mb-4">
          {["student", "teacher", "parent"].map((roleOption) => (
            <button
              key={roleOption}
              className={`btn ${role === roleOption ? "btn-success" : "btn-outline-primary"} w-25`}
              onClick={() => setRole(roleOption)}
            >
              {roleOption === "student" ? "تلميذ" : roleOption === "teacher" ? "معلم" : "ولي أمر"}
            </button>
          ))}
        </div>

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

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            onClick={handleLogin}
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            ليس لديك حساب؟ <a href="/register">سجل الآن</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
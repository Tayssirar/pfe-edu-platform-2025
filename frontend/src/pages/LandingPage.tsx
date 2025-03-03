import React, { useState } from "react";
import Lottie from "react-lottie";
import { lottieOptions } from "../lottieConfig"; // Import the shared Lottie config
import birdShowing from "../assets/bird-showing.json";
import { useNavigate } from "react-router-dom"; // React Router v6 hook for navigation
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  const [showToast, setShowToast] = useState(false); // To control the toast visibility
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleRoleClick = (selectedRole: string) => {
    setRole(selectedRole);
    setShowToast(true); // Show toast
    setTimeout(() => {
      navigate("/login"); // Redirect to the login page after 2 seconds
    }, 2000);
  };

  return (
    <div className="bg-white text-dark" dir="rtl">
      {/* Header Section */}
      <header className="bg-warning text-center py-5">
        {/* Lottie animation */}
        <Lottie options={lottieOptions(birdShowing)} height={150} width={200} style={{ margin: "0 auto", display: "block" }} />
        
        <h1 className="display-4 fw-bold">تعلم مع عصفور</h1>
        <p className="lead">ألعاب تعليمية ممتعة تبقي المتعلمين متحمسين.</p>
        <Link className="btn btn-orange mt-3" to={"/login"}>          العب الآن!

        </Link>

      </header>

      {/* Main Sections */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 p-4 bg-primary text-white">
            <h2 className="h4">مصمم لاحتياجات المعلمين</h2>
            <p>يمكن للمعلمين إنشاء أسئلة مخصصة أو استخدام الأسئلة الجاهزة لدعم طلابهم.</p>
          </div>
          <div className="col-md-4 p-4 bg-success text-white">
            <h2 className="h4">يدعم التعلم عن بعد</h2>
            <p>يمكنك مشاركة الألعاب بسهولة مع الطلاب سواء في الفصل أو في المنزل.</p>
          </div>
          <div className="col-md-4 p-4 bg-warning text-dark">
            <h2 className="h4">اللعب على أجهزة متعددة</h2>
            <p>يعمل على أجهزة الآيباد، وأجهزة الكمبيوتر، والسبورات التفاعلية.</p>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="bg-light py-5 text-center">
        <h2 className="h3 fw-bold">من أنت؟</h2>
        <div className="d-flex justify-content-center gap-3 mt-4">
          {[
            { role: "معلم", color: "primary" },
            { role: "ولي أمر", color: "success" },
            { role: "تلميذ", color: "warning" }
          ].map(({ role, color }) => (
            <div
              key={role}
              className={`card bg-${color} text-white p-3 w-25 cursor-pointer`}
              style={{ cursor: "pointer" }}
              onClick={() => handleRoleClick(role)}
            >
              <div className="card-body">
                <h3 className="h5">{role}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="toast show position-fixed top-0 end-0 m-3"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">تسجيل الدخول</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            تم تسجيل الدخول كـ {role}. سيتم توجيهك إلى صفحة الدخول...
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2025 تعلم مع عصفور. جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default LandingPage;

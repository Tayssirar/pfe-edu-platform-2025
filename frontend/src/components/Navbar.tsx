import React from "react";
import { Link, useNavigate } from "react-router-dom";

type NavbarProps = {
    role: string; // Defining valid role types
    username: string | null;
    onLogout: () => void;
  };
  
  const Navbar: React.FC<NavbarProps> = ({ role, username, onLogout }) => {
    // Dynamic links based on user role
    const renderLinks = () => {
      switch (role) {
        case "teacher":
          return (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/teacher/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teacher/students">Students</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teacher/lessons">Lessons</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teacher/results">Results</Link>
              </li>
            </>
          );
        case "parent":
          return (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/parent/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/parent/students">View Children</Link>
              </li>
            </>
          );
        case "admin":
          return (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/manage">Manage Users</Link>
              </li>
            </>
          );
        default:
          return null;
      }
    };
  
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Logo</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {renderLinks()}
            {username && (
              <li className="nav-item">
                <span className="nav-link">{`Hello, ${username}`}</span>
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-outline-danger" onClick={onLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  };
  

export default Navbar;

import React, { useState } from 'react'
import Navbar from '../components/Navbar'

function TeacherDash() {
    const [username, setUsername] = useState<string | null>("John Doe"); // Example username
    const [role, setRole] = useState("teacher"); // Assuming this is dynamically set based on the logged-in user
    
    // Example logout function
    const handleLogout = () => {
      // Perform logout actions, like clearing local storage or session
      console.log("Logging out...");
      setUsername(null); // Clear username after logout
    };
  return (
    <div>
            <Navbar role={role} username={username} onLogout={handleLogout} />



            <div className="row">
        {/* Left 1/3 - Lesson Reports */}
        <div className="col-md-4">
          <div className="bg-light p-3 rounded shadow-sm">
            <h4>Rapports des leçons</h4>
            <ul className="list-group">
              <li className="list-group-item">Leçon 1: Mathématiques</li>
              <li className="list-group-item">Leçon 2: Français</li>
              <li className="list-group-item">Leçon 3: Anglais</li>
              {/* Add more reports here */}
            </ul>
          </div>
        </div>

        {/* Right 2/3 - Create Lesson Card and List of Created Lessons */}
        <div className="col-md-8">
          <div className="card mt-3">
            <div className="card-body">
              <h4 className="card-title">Créez votre leçon</h4>
              <button className="btn btn-primary">Créer une nouvelle leçon</button>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Leçons déjà créées</h5>
              <ul className="list-group">
                <li className="list-group-item">Leçon 1: Mathématiques</li>
                <li className="list-group-item">Leçon 2: Français</li>
                <li className="list-group-item">Leçon 3: Anglais</li>
                {/* Add more lessons here */}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default TeacherDash

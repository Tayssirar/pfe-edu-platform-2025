import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { getStudentsByTeacher, linkStudent, deleteStudent, searchStudent, getUnlinkedStudentsBySchool} from "../../api/studentList";
import { useLocation, useNavigate } from "react-router-dom";
import StudentAchievements from "../../components/activity/Achievements"; // import the achievements component

type Student = {
  uniqueIdentifier: string;
  childName: string;
  parentName: string;
  school: string;
  avatar: {
    profile: string;
  };
};

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false); // State for achievements modal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null); // Store selected student ID
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");
  const teacherId = user.id;
  const teacherSchool = user.school;

  const fetchStudents = async (teacherId: string) => {
    try {
      if (!teacherId) {
        console.error("No teacherId found");
        return;
      }
      
      const studentsData = await getStudentsByTeacher(teacherId);
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const autoLinkStudents = async (teacherSchool: string, teacherId: string) => {
    try {
      const unlinkedStudents = await getUnlinkedStudentsBySchool(teacherSchool);
  
      for (const student of unlinkedStudents) {
        
        await linkStudent(teacherId, student.uniqueIdentifier);
      }
  
      // After linking, fetch again
      fetchStudents(teacherId);
    } catch (error) {
      console.error("Error auto-linking students:", error);
    }
  };

  useEffect(() => {
    if (teacherId && teacherSchool) {
      fetchStudents(teacherId);
      autoLinkStudents(teacherSchool, teacherId);
    }
  }, [teacherId]);
  

  const handleDelete = async (uniqueIdentifier: string) => {
    try {
      await deleteStudent(teacherId, uniqueIdentifier);
      fetchStudents(teacherId);
    } catch (error) {
      console.error("خطأ في حذف التلميذ", error);
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const result = await searchStudent(query);
        setSearchResults(result ? [result] : []);
      } catch (error) {
        console.error("خطأ في البحث عن التلميذ", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleViewAchievements = (student: Student, teacherId: string) => {
    navigate(`/achievements/${student.uniqueIdentifier}`, { state: { student, teacherId } });
  };
  

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        إضافة تلميذ
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>المعرف الفريد</th>
            <th>اسم الطفل</th>
            <th>اسم الولي</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.uniqueIdentifier}>
              <td><img src={student.avatar?.profile} alt="Student" style={{ width: "30px", height: "30px" }} /></td>
              <td>{student.uniqueIdentifier}</td>
              <td>{student.childName}</td>
              <td>{student.parentName}</td>
              <td className="d-flex justify-content-between">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(student.uniqueIdentifier)}
                >
                  حذف
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewAchievements(student, teacherId)}
                >
                  عرض الإنجازات
                </Button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Achievements Modal */}
      <Modal show={showAchievementsModal} onHide={() => setShowAchievementsModal(false)} size="lg">
        <Modal.Header closeButton>
        {selectedStudentId && <StudentAchievements studentId={selectedStudentId} />}

        </Modal.Header>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إضافة تلميذ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <Form.Group>
              <Form.Label>بحث عن تلميذ</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل المعرف الفريد للتلميذ"
                value={searchQuery}
                onChange={handleSearch}
              />
            </Form.Group>

            {searchResults.length > 0 && (
              <div>
                <h5>نتائج البحث:</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th></th>
                      <th>المعرف الفريد</th>
                      <th>اسم الولي</th>
                      <th>اسم الطفل</th>
                      <th>الصورة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((student) => (
                      <tr key={student.uniqueIdentifier}>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={async () => {
                              try {
                                await linkStudent(teacherId, student.uniqueIdentifier);
                                fetchStudents(teacherId); 
                                setShowModal(false);
                              } catch (error) {
                                console.error("خطأ في ربط التلميذ", error);
                              }
                            }}
                          >
                            إضافة
                          </Button>
                        </td>
                        <td>{student.uniqueIdentifier}</td>
                        <td>{student.parentName}</td>
                        <td>{student.childName}</td>
                        <td><img src={student.avatar?.profile} alt="" style={{ width: "30px", height: "30px" }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentsList;

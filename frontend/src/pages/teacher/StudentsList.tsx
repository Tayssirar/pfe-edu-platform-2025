import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { getStudentsByTeacher, linkStudent, deleteStudent, searchStudent } from "../../api/studentList";
import { useLocation } from "react-router-dom";

type Student = {
  photo: string;
  uniqueIdentifier: string;
  childName: string;
  parentName: string;
  school: string;
};

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const location = useLocation();

  const user = location.state?.user || JSON.parse(localStorage.getItem("user") || "null");
  const teacherId = user.id;


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

  useEffect(() => {
    fetchStudents(teacherId);
  }, [teacherId]); // Run when teacherId changes
  


  const handleDelete = async (uniqueIdentifier: string) => {
    try {
      await deleteStudent(teacherId, uniqueIdentifier);
      fetchStudents(teacherId);
    } catch (error) {
      console.error("خطأ في حذف الطالب", error);
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
        console.error("خطأ في البحث عن الطالب", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={() => setShowModal(true)}>
        إضافة طالب
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>المعرف الفريد</th>
            <th>اسم الطفل</th>
            <th>اسم الوالد</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.uniqueIdentifier}>
              <td>{student.photo}</td>
              <td>{student.uniqueIdentifier}</td>
              <td>{student.childName}</td>
              <td>{student.parentName}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(student.uniqueIdentifier)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إضافة طالب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <Form.Group>
              <Form.Label>بحث عن طالب</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل المعرف الفريد للطالب"
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
                      <th>اسم الوالد</th>
                      <th>اسم الطفل</th>
                      <th>الصورة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((student) => (
                      <tr key={student.uniqueIdentifier}>
                        <td> <Button
                          variant="primary"
                          size="sm"
                          onClick={async () => {
                            try {
                              await linkStudent(teacherId, student.uniqueIdentifier);
                              fetchStudents(teacherId); 
                              setShowModal(false);
                            } catch (error) {
                              console.error("خطأ في ربط الطالب", error);
                            }
                          }}
                        >
                          إضافة
                        </Button>

                        </td>
                        <td>{student.uniqueIdentifier}</td>
                        <td>{student.parentName}</td>
                        <td>{student.childName}</td>
                        <td>{student.photo}</td>
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

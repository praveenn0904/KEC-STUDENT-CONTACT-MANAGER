// src/components/StudentManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Student.css';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollno: '',
        department: '',
        section: '',
        yearofStudy: '',
        phonenumber: '',
        mailid: '',
        linedin: '',
        leetcode: '',
        github: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [isEditing, setIsEditing] = useState(false); // State to determine if editing
    const [currentStudentId, setCurrentStudentId] = useState(null); // Current student ID for editing
    const [isViewing, setIsViewing] = useState(false); // State to determine if viewing details

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleAddStudent = async () => {
        try {
            await axios.post('http://localhost:3000/students', newStudent);
            fetchStudents();
            resetNewStudent();
            closeModal(); // Close modal after adding student
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleUpdateStudent = async () => {
        try {
            await axios.put(`http://localhost:3000/students/${currentStudentId}`, newStudent);
            fetchStudents();
            resetNewStudent();
            closeModal(); // Close modal after updating student
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`http://localhost:3000/students/${id}`);
                fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    const resetNewStudent = () => {
        setNewStudent({
            name: '',
            rollno: '',
            department: '',
            section: '',
            yearofStudy: '',
            phonenumber: '',
            mailid: '',
            linedin: '',
            leetcode: '',
            github: ''
        });
    };

    const openModal = (student = null, isView = false) => {
        if (student) {
            if (isView) {
                setIsViewing(true);
                setNewStudent(student); // Set student data for viewing
            } else {
                setIsEditing(true);
                setCurrentStudentId(student.id);
                setNewStudent(student); // Set student data for editing
            }
        } else {
            setIsEditing(false);
            setIsViewing(false);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetNewStudent(); // Reset the form when closing modal
        setIsViewing(false); // Reset viewing state
    };

    return (
        <div className="student-management">
            <h1>KEC STUDENT CONTACT MANAGEMENT PORTAL</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => openModal()}>Add Student</button>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Department</th>
                            <th>Section</th>
                            <th>Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.filter(student => 
                            student.name.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(student => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.rollno}</td>
                                <td>{student.department}</td>
                                <td>{student.section}</td>
                                <td>{student.yearofStudy}</td>
                                <td>
                                    <button onClick={() => openModal(student, true)}>View</button>
                                    <button onClick={() => openModal(student)}>Edit</button>
                                    <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for adding or editing a student */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add or Edit Student"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        padding: '20px',
                    },
                }}
            >
                <h2>{isEditing ? 'Student Details' : (isViewing ? 'Student Details' : 'Add New Student')}</h2>
                {isViewing ? (
                    <div className='view'>
                        <p><strong>Name:</strong> {newStudent.name}</p>
                        <p><strong>Roll No:</strong> {newStudent.rollno}</p>
                        <p><strong>Department:</strong> {newStudent.department}</p>
                        <p><strong>Section:</strong> {newStudent.section}</p>
                        <p><strong>Year of Study:</strong> {newStudent.yearofStudy}</p>
                        <p><strong>Phone Number:</strong> {newStudent.phonenumber}</p>
                        <p><strong>Email:</strong> {newStudent.mailid}</p>
                        <p><strong>LinkedIn:</strong> {newStudent.linedin}</p>
                        <p><strong>LeetCode:</strong> {newStudent.leetcode}</p>
                        <p><strong>GitHub:</strong> {newStudent.github}</p>
                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Roll No"
                            value={newStudent.rollno}
                            onChange={(e) => setNewStudent({ ...newStudent, rollno: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Department"
                            value={newStudent.department}
                            onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Section"
                            value={newStudent.section}
                            onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Year of Study"
                            value={newStudent.yearofStudy}
                            onChange={(e) => setNewStudent({ ...newStudent, yearofStudy: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={newStudent.phonenumber}
                            onChange={(e) => setNewStudent({ ...newStudent, phonenumber: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newStudent.mailid}
                            onChange={(e) => setNewStudent({ ...newStudent, mailid: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="LinkedIn"
                            value={newStudent.linedin}
                            onChange={(e) => setNewStudent({ ...newStudent, linedin: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="LeetCode"
                            value={newStudent.leetcode}
                            onChange={(e) => setNewStudent({ ...newStudent, leetcode: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="GitHub"
                            value={newStudent.github}
                            onChange={(e) => setNewStudent({ ...newStudent, github: e.target.value })}
                        />
                        <button onClick={isEditing ? handleUpdateStudent : handleAddStudent}>
                            {isEditing ? 'Update' : 'Submit'}
                        </button>
                    </>
                )}
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default StudentManagement;

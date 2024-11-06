// src/App.js
import React from 'react';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import Login from "./components/auth/login";
import Register from "./components/auth/Register";
import StudentManagement from "./components/StudentManagement";

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/students" element={<StudentManagement/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;

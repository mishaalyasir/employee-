import React from 'react'
import SignupForm from './signup'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Dashboard from "./dashboard";
import LogReview from "/logReview";
import './index.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignupForm/>} />   
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logreview" element={<LogReview />} />
      </Routes>
    </Router>
  );
}

export default App;




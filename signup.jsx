import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    gender: "", 
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const navigate = useNavigate();  

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Employee Info Submitted:", formData);

    // Save all important user data to localStorage
    localStorage.setItem("userName", formData.name);
    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("userPassword", formData.password);
    localStorage.setItem("userPosition", formData.position);
    localStorage.setItem("userGender", formData.gender);


    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Employee Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />

        <input
          type="text"
          name="position"
          placeholder="Job Title / Position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl"
          required
        />
        <input
  type="text"
  name="gender"
  placeholder="Gender (Male/Female)"
  value={formData.gender}
  onChange={handleChange}
  className="w-full px-4 py-2 border rounded-xl"
  required
/>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

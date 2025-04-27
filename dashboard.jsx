import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


function Dashboard() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    position: "",
    salary: "$5000",
    gender: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [leaveApplication, setLeaveApplication] = useState("");
  const [leaveStatus, setLeaveStatus] = useState(null);

  const navigate = useNavigate();
  const goToLogReview = () => {
    navigate("/logreview");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPosition = localStorage.getItem("userPosition");
    const storedGender = localStorage.getItem("userGender");

    if (!storedEmail) {
      navigate("/login");
    }

    setUserData({
      name: storedName || "",
      email: storedEmail || "",
      position: storedPosition || "",
      salary: "$5000",
      gender: storedGender || "",
    });
  }, [navigate]);

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Task Management States
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  const createTask = async () => {
    await axios.post("http://localhost:5000/tasks", { title, description, assignedTo });
    setTitle("");
    setDescription("");
    setAssignedTo("");
    fetchTasks();
  };

  const updateTaskStatus = async (id, newStatus) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    updateTaskStatus(taskId, newStatus);
  };

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">DASHBOARD</h2>
        <nav className="flex flex-col space-y-5">
          <button onClick={() => setActiveSection("dashboard")} className="sidebar-btn">Dashboard</button>
          <button onClick={() => setActiveSection("checkin")} className="sidebar-btn">Check In/Out</button>
          <button onClick={() => setActiveSection("leave")} className="sidebar-btn">Leave</button>
          <button onClick={() => setActiveSection("profile")} className="sidebar-btn">Profile</button>
          <button onClick={() => setActiveSection("salary")} className="sidebar-btn">Salary</button>
          <button onClick={() => setActiveSection("tasks")} className="sidebar-btn">Task Management</button>
          <button onClick={goToLogReview} className="sidebar-btn">View HR Logs</button>
          <button onClick={handleLogout} className="sidebar-btn text-red-500 mt-10">Logout</button>
        </nav>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex justify-center items-center overflow-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          {activeSection === "tasks" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Task Management</h2>
              <div className="mb-4">
                <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">Assign To</option>
                  {users.map((user) => (
                    <option key={user._id} value={user.username}>{user.username}</option>
                  ))}
                </select>
                <button onClick={createTask} className="bg-blue-500 text-white px-4 py-2 rounded">Create Task</button>
              </div>

              {/* Task Board */}
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex justify-between">
                  {statuses.map((status) => (
                    <Droppable droppableId={status} key={status}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="task-column">
                          <h3>{status}</h3>
                          {tasks.filter((task) => task.status === status).map((task, index) => (
                            <Draggable draggableId={task._id} index={index} key={task._id}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="task-card">
                                  <strong>{task.title}</strong><br />
                                  Assigned: {task.assignedTo}<br />
                                  <button onClick={() => updateTaskStatus(task._id, "To Do")}>To Do</button>
                                  <button onClick={() => updateTaskStatus(task._id, "In Progress")}>In Progress</button>
                                  <button onClick={() => updateTaskStatus(task._id, "Done")}>Done</button>
                                  <button onClick={() => deleteTask(task._id)} className="text-red-500">Delete</button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

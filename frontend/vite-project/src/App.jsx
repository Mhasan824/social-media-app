import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// FIXED: Capitalized paths to match your actual filenames in image_588ddc.png
import Login from "./components/Login";
import SignIn from "./components/SignIn";
import About from "./components/About";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        // TIP: Change this to your live Render URL later!
        let res = await axios.get(`http://localhost:3000/`);
        setData(res.data.msg);
      } catch (err) {
        setData("Server not reachable");
      }
    };
    getData();
  }, []);

  return (
    <Router>
      <div>
        <nav className="flex gap-4 p-4 bg-gray-100 shadow-sm">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          <Link to="/SignIn" className="text-blue-600 hover:underline">SignIn</Link>
          <Link to="/About" className="text-blue-600 hover:underline">About</Link>
          <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
        </nav>

        <div className="w-full flex justify-evenly">
          <h1 className={`m-2 px-8 py-3 w-full text-white rounded-md text-xl text-center transition-all duration-500 
            ${data?.toLowerCase().includes("already") ? "bg-red-600" : "bg-blue-600"}`}>
            {data || "Loading..."}
          </h1>
        </div>

        <Routes>
          <Route path="/" element={
            <div className="text-center mt-10">
              <h2 className="text-2xl font-bold">Welcome to Our Portal</h2>
              <p className="text-gray-600">Please navigate to the registration page to create an account.</p>
            </div>
          } />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/About" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Login setData={setData} data={data} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
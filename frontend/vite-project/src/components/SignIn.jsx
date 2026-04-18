import React, { useState,useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
const initialCredentials = {  Email : "", Password : ""};
const SignIn = () => {
  const navigate = useNavigate(); // Hook initialize karein
  const [credentials , setCredentials] = useState(initialCredentials);

 const ResetFunc = () => {
  setCredentials(initialCredentials);
 }

 const chngHandler = (e) => {
  let { name, value } = e.target;
  setCredentials({ ...credentials, [name]: value });
};

const submitFunc = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("${import.meta.env.VITE_API_URL}/login", credentials, { withCredentials: true });
    alert(res.data.msg); // Success message
    navigate("/dashboard"); // User ko agle page par bhejein
  } catch (error) {
    // 400 status code yahan handle hoga
    console.log("Error Data:", error.response.data); 
    alert(error.response.data.msg); // Yeh "wrong credentials" dikhayega
  }

 }

useEffect(() => {
  console.clear(); // Agar aap hamesha saaf console chahte hain
  console.log("Latest Credentials:", credentials);
}, [credentials]);

  return (
    
    <div className="flex  justify-center ">
  <div className="bg-white shadow-lg rounded-lg p-6 w-96">
    <h2 className="text-2xl font-bold text-center mb-4">Login Your ID</h2>
    <form onSubmit={submitFunc} 
    autoComplete="off">
      <div className="mb-4">
        <input 
         
          type="email"
          name="Email"
          value = {credentials.Email}
          placeholder="Email"
          onChange={chngHandler}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          
          required
        />
      </div>
      <div className="mb-4">
        <input 
         
          type="password"
          name="Password"
          value = {credentials.Password}
          placeholder="Password"
          onChange={chngHandler}
          
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
             autoComplete="new-password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 mb-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
      <button 
      onClick={ResetFunc}
      className="w-full bg-blue-600 text-white py-2  rounded hover:bg-blue-700 transition">
        Reset</button>
    </form>
  </div>
</div>

    
  )
}

export default SignIn
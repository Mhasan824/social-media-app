import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 1. Initial State ko bahar rakhne se reset karna asaan ho jata hai
const initialFormState = {
  name: "",
  username: "",
  email: "",
  password: ""
};

const Login = ({ setData,data }) => {
  // 2. State ko initial values se start karein
  const navigate=useNavigate()
  const [formData, setFormData] = useState(initialFormState);

  const handleReset = (e) =>{
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    // Destructuring: taaki code saaf lage
    let { name, value } = e.target;
    setFormData ({...formData, [name]: value });
   
    
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/register", formData, {
    withCredentials: true});
      alert("Success: " + res.data.msg);
      navigate("/signin")

      // 3. Jadu ki line: Submit ke baad form wapas khali!
      

    } catch (err) {
      if (err.response){
        setData(err.response.data.message)
        alert(err.response.data.message)
        setTimeout(() => {
      setFormData(initialFormState); 
      
    }, 500);
    
        
    


      } else {
        setData("Server Down!")
        console.error(err);
        alert("Error connecting to server");
      }
    }
   // console.log("Current State:", formData);

    setTimeout(() => {
      setFormData(initialFormState); 
      setData(data)
    }, 3000);
  };

  return (
    <div className="w-full flex justify-center p-4">
      <form onSubmit={handleSubmit} className="w-96 p-6 border rounded shadow-md space-y-4">
        
        <label className="block text-sm font-semibold">Name</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            name="name" 
            placeholder="First name" 
            value={formData.name} // <--- Binding
            onChange={handleChange} 
            className="w-1/2 border rounded px-3 py-2" 
            required 
          />
          <input 
            type="text" 
            name="username" 
            placeholder="Surname" 
            value={formData.username} // <--- Binding
            onChange={handleChange} 
            className="w-1/2 border rounded px-3 py-2" 
            required 
          />
        </div>
        
        <label className="block text-sm font-semibold">Email</label>
        <input 
          id="email"
          type="email" 
          name="email" 
          placeholder="email" 
          value={formData.email} // <--- Binding
          onChange={handleChange} 
          className="w-full border rounded px-3 py-2" 
          required 
        />

        <label className="block text-sm font-semibold">New password</label>
        <input 
          type="password" 
          name="password" 
          placeholder="password" 
          value={formData.password} // <--- Binding
          onChange={handleChange} 
          className="w-full border rounded px-3 py-2" 
          required 
        />

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700"
        >
          Create Account
        </button>
        <button type="button" onClick={handleReset} className="w-full text-white cursor-pointer bg-green-600 py-2 rounded-full"> Reset button</button>
      </form>
    </div>
  );
};

export default Login;
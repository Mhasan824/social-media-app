import axios from "axios";


export const getUserData=async()=>{
    const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify`)
}
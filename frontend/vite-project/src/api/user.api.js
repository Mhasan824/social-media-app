import axios from "axios";


export const getUserData=async()=>{
    const res=await axios.get(`${import.meta.env.VITE_API_URL}/verify`)
}
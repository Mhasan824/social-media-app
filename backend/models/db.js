import mongoose from "mongoose"

export const connectDb=async()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/miniproject');
        console.log('db is connected..');
        
    } catch (error) {
        console.error(error.message);
        
    }
    
}
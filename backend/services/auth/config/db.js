import mongoose from "mongoose"

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB CONNECTED ");
    } catch (error) {
        console.log(`DB ERROR ${error}`);
    
    }
}
export default connectDB;
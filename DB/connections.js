import mongoose from "mongoose";


export const connectDB =async ()=>{
    return await mongoose.connect(process.env.CONNCTION_URL)
    .then(()=>console.log("db coneteed"))
}


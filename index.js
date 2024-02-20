import express from 'express'
import { connectDB } from './DB/connections.js'
import userRouter from "./src/modules/user/user.router.js"
import companyRouter from "./src/modules/company/company.router.js"
import jobRouter from "./src/modules/Job/job.router.js"
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = process.env.PORT
 app.use(express.json())






await connectDB()


app.use("/user",userRouter)
app.use("/company", companyRouter)
app.use("/job",jobRouter)


app.all("*",(req,res,next)=>{
return res.json({success:false,message:"Page Not Found"})
})

app.use((error,req,res,next) => {
    return res.json({
        success:false,
         message:error.message,
         stack:error.stack
         
         
        
        })
        
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
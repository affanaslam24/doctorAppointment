import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import router from './routes/adminRoute.js' //this is the route for the admin page
import userRouter from './routes/userRoutes.js'
import doctorRoute from './routes/dooctorRoute.js'

// app configuration
const app = express() //its like in your python where you create an instance
const port= process.env.PORT || 4000

//app middleware
app.use(express.json())
app.use(cors())
connectDb()
connectCloudinary()

//api endpoints

app.use('/api/admin', router) //this is the route for the admin page
// localhost:4000/api/admin/add-doctor, when we go to this endpoint our adddoctor function will be called

app.use('/api/user', userRouter)
//this is the route from the userRouter.js file
//so itll be localhost:4000/api/user/register or localhost:4000/api/user/login
//basically, the userRouter.js file is the route for the user page

//app.use('/api/doctor', doctorRoute)
app.get('/', (req,res)=>{
    res.send('API working bittttcchchchchch')

})



console.log("Cloudinary key:", process.env.CLOUDINARY_API_KEY)


app.listen(port, ()=> console.log("Server Started", port))



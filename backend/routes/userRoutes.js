import express from 'express';
import { registerUser,loginUser, getProfile, updateProfile, bookAppointment } from '../controller/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
//expose this route, and add it to the server.js now


userRouter.post('/login', loginUser);
//this is the route for the login function

userRouter.get('/get-profile', authUser, getProfile);
//for jwt, checking wiht the middleware, we are using the middlerware at route section

//since we are using cloudinary upload we need multer
//also note, we need the userId, which we will get from the token, and this userId is required
// to update the profile, and for that, we will use authUser middleware
userRouter.post('/update-profile', upload.single('image'), authUser,updateProfile);



//appointment route
userRouter.post('/book-appointment', authUser, bookAppointment);

export default userRouter;


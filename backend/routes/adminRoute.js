//so the routing for the add doctor and multer will happen here
import express from 'express';
import { addDoctor, adminLogin, listDoctors } from '../controller/adminController.js';
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();
//authadmi is a middleware which is used to check for jwt token, and allows the admin to do the neccessary changes
router.post('/add-doctor', upload.single('image'), addDoctor);// this adddoctor will be called when/add-doctor is hit
//now, directly make use of this router in server js
//so, well make a middleware, and if the admin is logged in, then only we will be able to add the doctor


router.post('/login', adminLogin);
//the admin login will be called when /login is hit 


//an api to route to the list all doctor funtion
router.post('/list-doctors', authAdmin, listDoctors)

export default router;
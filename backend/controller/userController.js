//logic for login, register, appointement booking, payment, etc for the user
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";

const registerUser = async (req, res) => {
    try{
        const{name, email, password} = req.body;
        //we take name, email and password from the request body
        //then we check if the email is present or not
        if(!email || !password || !name)
        {
            return res.json({success: false, message: "Please fill all the fields"})
        }
        if(!validator.isEmail(email))
        {
            return res.json({success: false, message: "Please enter a valid email"})
        }
        //check if the email is already present in the database
        const emailCheck= await userModel.findOne({email});
        if(emailCheck)
        {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        else{

        if(password.length < 8)
        {
            return res.json({success: false, message: "please enter a strong password"})
        }


        //but now encrypt the password before saving it.
        //hashing
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //now save the data to database

        const userData = {
            name,
            email,
            password: hashedPassword
        }
        //now, lets make the schema for our database, and then send this data to the database 
        //oh we already have that in our userModel 
        //notice that the first three fiellds of the schema are same as the fields we have in the request body
        //the other fields will be updated in the myprofile page, not during the login or register page, so we are
        //not creating the logic for saving the adres, image and others over here.

        //now, saving in the database by calling forth the schema
        const newUser = new userModel(userData);
        //the above creates a sort of data package, now we save

        const user = await newUser.save();
        //now we have the data saved in the database
        // in this user, we get a _id field.
        //we will use this _id field to use and make a jwt token

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        //then send back the jwt token
        res.json({success: true, message: "User registered successfully", token});
    }

    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });

    }

}


//api function for login user
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        //check if the email and password are present
        if(!email || !password)
        {
            return res.status(401).json({success: false, message: "Please fill all the fields"})
        }
        //check if the email is valid
        if(!validator.isEmail(email))
        {
            return res.status(401).json({success: false, message: "Please enter a valid email"})
        }

        //find the user in the database
        const user = await userModel.findOne({email});
        if(!user)
        {
            // if the user is not found, return false
            //this is the case when the user is not registered
            //this will stop the inside code from executing
            //basically we leave the stack
            return res.status(401).json({success: false, message: "User not found"})
        }
        //compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch)
        {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            //we created a token using the _id of the user
            //mind you, itll be the same token for the same user, so we can use this token to authenticate the user
            //itll be same because we are using the same secret key to sign the token, and the _id of the user  is also same
            //so we can use this token to authenticate the user in the future
            //now we send the token back to the user
            return res.status(200).json({success: true, message: "User logged in successfully", token});
        }
        
        return res.status(401).json({success: false, message: "Invalid credentials"})
    
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });

    }
}


const getProfile = async (req, res) => {
    try{
        const userId = req.userId;
        //console.log(userId);
        //we'll not get the userId from the user, we will get the token
        //and then we will decode the token to get the userId
        //the function calling this getprofile function will be the one to send the token




        const userData = await userModel.findById(userId).select("-password");
        res.json({success: true, userData}); // we are sedning the whole user Data
    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });

    }
}

//api to update user profile
const updateProfile = async (req, res) => {
    try{

        //authUser is using a different method to send the request userId, its not using the body
        const userId = req.userId;
        console.log(userId);
        //the userId wil be sent thorugh authUser middleware 
        const { name, phone, address, dob, gender } = req.body;
        console.log(req.body);

        const imageFile=req.file;
        //if you want to upload an image

        if( !name || !dob || !phone || !gender)
        {
            return res.json({success: false, message: "Please fill all the fields"})
        }
        
        //itll use userId to find the user in the database and then update based on the things
        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address) , dob, gender});
        
        if(imageFile)
        {
            const image = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });
            const imageURL=image.secure_url;
            //this will upload the image to the cloudinary
            await userModel.findByIdAndUpdate(userId, {image: imageURL});
        }

        
        
        res.json({success: true, message:"succesfully updated"}); // we are sedning the whole user Data
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });

    }

}


//api to book appointment

const bookAppointment = async (req, res) => {
    try{
        const userId = req.userId;
        
        
        const { docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select('-password');
        console.log(docId);

        if(!docData.available)
        {
            return res.json({success: false, message: "Doctor is not available"})
        }

        let slots_booked = docData.slots_booked;

        if(slots_booked[slotDate])
        {
            if(slots_booked[slotDate].includes(slotTime))
            {
                return res.json({success: false, message: "Slot not available"})
            }
            else
            {
                slots_booked[slotDate].push(slotTime);
                //this will add the slot to the array
            }
        }
        else
        {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime)
            //this will create a new array with the slotTime    
        }


        const userData = await userModel.findById(userId).select("-password");

        //remove the slot data from the docData now

        delete docData.slots_booked

        const appointementData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointementData);
        //using the appointment model to save the data

        await newAppointment.save();


        //also, save the new slot inofrmation in the doctor slot
        await doctorModel.findByIdAndUpdate(docId, {slots_booked});

        res.json({success: true, message:"succesfully booked appointment"}); // we are sedning the whole user Data





        if( !docId || !slotDate || !slotTime || !amount)
        {
            return res.json({success: false, message: "Please fill all the fields"})
        }
        
        //itll use userId to find the user in the database and then update based on the things
        await userModel.findByIdAndUpdate(userId, {docId, slotDate, slotTime, amount});
        
        
        res.json({success: true, message:"succesfully booked appointment"}); // we are sedning the whole user Data
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });

    }

}


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment};
//create a route for this register function
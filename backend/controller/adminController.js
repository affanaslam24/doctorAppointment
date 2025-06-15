import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
//becasuse this is where the connection with doctor schema is happening

//API for adding doctor through admin page

const addDoctor = async (req, res) => {

    try {
        //we take these data
        const { name, email, password, degree,specialization, experience, about, fees, address } = req.body;
        //we use middleware like multer to upload the image

        //to save the above const file
        //const imageFile = req.file;


        //now, we can save this data to our database

        //first we check if the required data is there or not
        if(!name || !degree || !email || !password || !specialization || !experience || !about || !fees || !address)
        {
            return res.json({success: false, message: "Please fill all the fields"})
        }

        //then we check if the email is already present or not
        if(!validator.isEmail(email))
        {
            return res.json({success: false, message: "Please enter a valid email"})
        }

        if(password.length < 8)
        {
            return res.json({success: false, message: "please enter a strong password"})
        }

        //hashing the password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //now we will upload image to cloudinary
        //const uploadImage = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"
        //});
        //the above statement will create a response while uploading to cloudinary, and that respooocnse
        //will be stored in uploadImage
        //now we will create a secure link for this uploadded image
        //const imageUrl = uploadImage.secure_url;
        let imageUrl = "";

        if (req.file) {
            const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image"
            }); 
            imageUrl = uploadImage.secure_url;
        }



        //now save the data to database, we have the image url, we have password, email and everything ready
        const doctorData= {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            specialization,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDocter = new doctorModel(doctorData);
        //create a new doctor object based on the dcotor model schema
        await newDocter.save();
        //save the doctor data to the database and awaiting for it
        //this will create a new doctor in the database
        //and save the data to the database

        res.json({
            success: true,
            message: "Doctor added successfully"})

    }catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Error in adding doctor",
            error: error.message
        })
    }


}


//api for the admin login
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        //we take email and password from the request body

        //then we check if the email and password is present or not
        if(email === process.env.ADMIN_EMAIL || password === process.env.ADMIN_PASSWORD)
        {
            //now we will use JWT for wuthetentication purpose

            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            //this will create a token using the email and password and secret key
            //this token will be used to authenticate the user
            //and we will send this token to the client
            res.json({
                success: true,
                message: "Admin login successful",
                token
            })
            //using this token, we will allow the admin to login
            //so itll work like this, we wont be able to add doctor until its found the one adding the doctor is the admin with this token
        }
        else
        {
            return res.json({success: false, message: "not the admin"})

        }
        //then we check if the email is valid or not
       


    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in admin login",
            error
        })
    }
}


//api to list all the doctor from the admin panel that were added to the database

const listDoctors = async (req, res) => {
    try {
        //doctor model is th eone whihc provides us with the schema
        const doctors = await doctorModel.find({}).select("-password");
        //removing th epassword section
        //this will find all the doctors in the database
        //and return them to the client
        res.json({
            success: true,
            message: "Doctors fetched successfully",
            doctors
        })
    }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Error in fetching doctors",
                error
            })
        }



}

export {addDoctor, adminLogin, listDoctors};

//this is still not done, we would be required routing for the adddoctor to use along wiht multer
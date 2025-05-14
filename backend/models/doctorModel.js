// mongoose model for the doctor
// basically schema for the doctor table or something

import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {type: String,required: true},

    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},    
    image: {type: String,required: true},
    specialization: {type: String,required: true},
    experience: {type: String,required: true},
    about: {type: String,required: true},
    available: {type: Boolean,default: true},
    fees: {type: Number,required: true},
    address: {type: Object,required: true},
    date: {type: Date,required: true},
    slots_booked: {type:Object, default: {}}//we'll configure this later on as per the booking of the slots

}, {minimize: false});   
//if we dont put minimise as false, then we cant put default as zero objects insdide slots booked


const doctorModel = mongoose.models.doctor ||  mongoose.model('doctor', doctorSchema);
//this is used to check if the model is already created or not and if not then create it

export default doctorModel;
//export the doctor model
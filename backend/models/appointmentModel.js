import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

    userId: {type: String, required: true},
    docId: {type: String, required: true},
    slotDate: {type: String, required: true},
    slotTime: {type: String, required: true},
    userData: {type: Object, required: true},
    docData: {type: Object, required: true},
    amount: {type: Number, required: true},
    date: {type: Number, required: true},
    cancelled: {type: Boolean, default: false},
    payment: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
})

//userId will be sent through middleware, the token and everything, remember
//doctorid, slotData, slotTime will be sent thorugh the frontend
//the rest will be calculated and stored in the backend logic itself

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);

export default appointmentModel;
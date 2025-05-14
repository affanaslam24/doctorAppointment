import doctorModel from "../models/doctorModel.js";


const doctorList = async (req, res) => {

    try{
        const doctors= await doctorModel.find({}).select('-password', '-email')

        res.status(200).json({ success: true, message: "Doctor List", doctors })
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }

}

export { doctorList }
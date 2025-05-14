import express from 'express'
import { doctorList } from '../controller/doctorController.js'


const doctorRoute = express.Router()

doctorRoute.get('/list', doctorList)

export default doctorRoute
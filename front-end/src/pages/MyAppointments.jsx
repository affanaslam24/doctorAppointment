import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const MyAppointments = () => {


  const{backendURL, token, getDoctorData }= useContext(AppContext)
  const [appointments, setAppointments] = useState([])


  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const slotDateFormat = (slotDate) => {

    const dateArray = slotDate.split('_')
    return dateArray[0]+ " "+ months[Number(dateArray[1])]+ " " + dateArray[2]

  }

  
  const getUserAppointments = async () => {
    try {

      const res = await axios.get(backendURL+'/api/user/list-appointment', {headers: {token}})
      console.log(res.data.appointments)
      if(res.data.success)
      {
        setAppointments(res.data.appointments)
        console.log(res.data.appointments)
      }
      else
      {
        toast.error(res.data.message)
      }

    }
    catch (error) {
      console.log(error.message)
      toast.error(error.message)
    }


  }

  const cancelAppointment = async (appointmentId) => {

    try {
      const res = await axios.post(backendURL+'/api/user/cancel-appointment', {appointmentId}, {headers: {token}})
      if(res.data.success)
      {
        toast.success(res.data.message)
        getUserAppointments()
        getDoctorData() // to refresh the doctor data if needed

      }
      else
      {
        toast.error(res.data.message)
      }
    }
    catch (error) {
      console.log("ddd"+error.message)
      toast.error(error.message)
    }

  }




  useEffect(() => {
    if(token)
    {
      getUserAppointments()
    }
    else
    {
      toast.warn('Please login to view your appointments')
    }
  }, [token])
  
  
  return (
    <div>

    <p className=' pb-3 mt-12 font-medium text-zinc-700 border-b  '>My appointments</p>
    <div>
    {
       appointments.map((item,index)=> (
        <div className=' grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>

         <div>
           <img className=' w-32 bg-indigo-50 ' src={item.docData.image} alt="" />
         </div>
         <div className=' flex-1 text-sm text-zinc-600'>
          <p className=' text-neutral-800 font-semibold'>{item.docData.name}</p>
          <p>{item.docData.speciality}</p>
          <p className=' text-zinc-700 font-medium mt-1 '>Address:</p>
          <p className=' text-xs '>{item.docData.address.line1}</p>
          <p className=' text-xs'>{item.docData.address.line2}</p>
          <p className=' text-sm mt-1 '><span className=' text-sm text-neutral-700 font-medium '>Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime} </p>
         </div>

         <div>

         </div>

         <div className=' flex flex-col gap-2 justify-end '>
         {!item.cancelled && <button className=' text-sm text-stone-500 text-center sm: min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300   '>Pay Online</button>} 
          {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className=' text-sm text-stone-500 text-center sm: min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300    '>Cancel appointment</button>}
         {item.cancelled && <button className=' text-sm text-stone-500 text-center sm: min-w-48 py-2 border rounded bg-red-100 hover:bg-red-200 transition-all duration-300   '>Appointment Cancelled</button>}
         </div>

        </div>

       ))
    }
      
    </div>


    </div>
  )
}

export default MyAppointments
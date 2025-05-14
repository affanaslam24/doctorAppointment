import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContext'
//import { useNavigate } from "react-router-dom";
import {useNavigate } from "react-router";
import {toast} from 'react-toastify'
import axios from 'axios'

const Login = () => {

  const { backendURL, token, setToken } = useContext(AppContext)
  console.log("backend URL: ", backendURL);

  const navigate = useNavigate()  

  const[state,setState]=useState('Sign Up')

  const[email,setEmail]= useState('')
  const[password,setPassword]= useState('')
  const[name,setName]= useState('')

  const onsubmitHandler = async  (event)=> {
    
     event.preventDefault()
     console.log("inside");

     try {

      if(state === 'Sign Up')
        {
          console.log("backend URL: ", backendURL+'/api/user/register');
           const res = await axios.post(backendURL+'/api/user/register', {name, email, password})
           //the post will return a success or fail inside the data const
           if(res.data.success)
           {
            localStorage.setItem('token', res.data.token)
            setToken(res.data.token)
   
           }
           else
           { 
             toast.error(data.message)
           }
        }
        else
        {
           const res = await axios.post(backendURL+'/api/user/login', {email, password})
          //the post will return a success or fail inside the data const
          if(res.data.success)
            {
          localStorage.setItem('token', res.data.token)
          setToken(res.data.token)
         }
         else
         { 
           toast.error(data.message)
         }
       }

     }
     catch (error) {
        console.log(error.message)
       toast.error(error.message)
      }

  }

  useEffect(() => {
    if(token)
    {
      // user should be led to the navigation page
      navigate('/')

    }

  
  
  },[token]) // whenever our token gets executed, this effect will work


  return (
    <form onSubmit={onsubmitHandler} className=' min-h-[80vh] flex items-center '>
      <div className=' flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96  border rounded-xl text-zinc-600 text-sm  shadow-lg      ' >
        <p className=' text-2xl font-semibold '>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
         <p>Please {state === 'Sign Up' ? "Sign up" : "login"} sign up to book appointment</p>
          {
             
              state === 'Sign Up' && <div className=' w-full'>

              <p>Full Name</p>
              <input  type="text" className=' border border-zinc-300 rounded w-full p-2 mt-1   '  onChange={(e)=> setName(e.target.value)} value={name} required/>
               
             </div>

          }
          
          
         
  
          <div className=' w-full'>
            <p>Email</p>
            <input type="email" className=' border border-zinc-300 rounded w-full p-2 mt-1   '   onChange={(e)=> setEmail(e.target.value)} value={email} required  />
          </div>
          <div className=' w-full'>
            <p>Password</p>
            <input type="password" className=' border border-zinc-300 rounded w-full p-2 mt-1   '   onChange={(e)=> setPassword(e.target.value)} value={password} required  />
          </div>

          <button type='submit' className=' bg-primary text-white w-full py-2 rounded-md text-base  '>{state === 'Sign Up' ? "Create Account" : "Login" }</button>
       {

           state === 'Sign Up'
           ? <p>Already have an account? <span onClick={()=> { setState('Login')}} className=' text-primary underline cursor-pointer '>Login here</span> </p> 
           : <p>Create an new account? <span onClick={()=> { setState('Sign Up')}} className=' text-primary underline cursor-pointer '>click here</span></p>
       }
      
      
      </div>


    </form>
  )
}

export default Login
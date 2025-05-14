import { createContext, useState, useEffect, useContext} from "react";
import { doctors } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider =(props)=>{

    const currencySymbol='$'
    const backendURL= import.meta.env.VITE_BACKEND_URL

    const [token, setToken] = useState(localStorage.getItem('token') || false)
    const [userData, setUserData] = useState(false)
    //const [setDoctors] = useState([])


    // const getDoctorData = async () => {
    //     try{

    //         const {data} = await axios.get(backendURL + '/api/doctor/list')
    //         if(data.success)
    //             {
    //                 //the get-profile function in the backend will return the user data, go check
    //                 setDoctors(data.doctors)}
    //                 else
    //                 {
    //                     toast.error(data.message)
    //                 }

    //     }
    //     catch(err){
    //         console.log(err.message)
    //         toast.error(err.message)
    //     }
    
    
    // }

    //download the userdatA FROM THE backedn database

    const loadUserData = async () => {
        try{

            const {data} = await axios.get(backendURL + '/api/user/get-profile', {headers: {token}})
            if(data.success)
                {
                    //the get-profile function in the backend will return the user data, go check
                    setUserData(data.userData)}
            else{
                toast.error(data.message)
            }
            
        }
        catch(err){
            console.log(err)
            toast.error(err.message)
        }
    
    
    }

    //this is done, but we have to set an effect, for when a user is logged in and not


    

    const value={
        doctors, 
        currencySymbol,
        token, setToken,
        backendURL,
        userData, setUserData,
        loadUserData, 
        
    }

    // useEffect(() => {
    //     //if there exists a token, then pass the token to the backend through the above fucntiion
    //     getDoctorData()
    // }, []) //pass the token

    useEffect(() => {

        if(token){
            //if there exists a token, then pass the token to the backend through the above fucntiion
            loadUserData()
        }
        else
        { 
            //when user logs out
            //set the user data as false, because the toekn gets empty automatically
            setUserData(false)
        }

    }, [token]) //pass the token



    return (
        <AppContext.Provider value={value}>
        {props.children}

        </AppContext.Provider>
    )
}


   


export default AppContextProvider;


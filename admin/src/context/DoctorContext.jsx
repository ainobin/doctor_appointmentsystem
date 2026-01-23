import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([])
    const [dashData,setDashData]=useState(null)
    const [profileData,setProfileData]=useState(null)

   const getAppointments = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{dToken}})
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(data.message)

        }
    }
    const completeAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId },{headers:{dToken}})
        if (data.success) {
            toast.success(data.message)
            getAppointments()
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }

}

const cancelAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId },{headers:{dToken}})
        if (data.success) {
            toast.success(data.message)
            getAppointments()
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }

}
const getDashData = async () => {
    try {

        const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })

        if (data.success) {
            setDashData(data.dashData)
            console.log(data.dashData)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

const getProfileData = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } });

        if (data.success) {
            setProfileData(data.profileData);
            console.log(data.setProfileData);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);

    }
}

const addPrescription = async (prescriptionData) => {
    try {
        const { data } = await axios.post(backendUrl + '/api/doctor/add-prescription', prescriptionData, { headers: { dToken } })
        
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
        return false
    }
}

const getPatientHistory = async (userId) => {
    try {
        const { data } = await axios.get(backendUrl + `/api/doctor/patient-history/${userId}`, { headers: { dToken } })
        
        if (data.success) {
            return data.prescriptions
        } else {
            toast.error(data.message)
            return []
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
        return []
    }
}


useEffect(() => {
    if (dToken) {
      localStorage.setItem('dToken', dToken)
    } else {
      localStorage.removeItem('dToken')
    }
  }, [dToken])



const value = {
        dToken, 
        setDToken,
        backendUrl,
        appointments,setAppointments,
        getAppointments,completeAppointment,cancelAppointment,
        dashData,setDashData,getDashData,profileData,setProfileData,getProfileData,
        addPrescription,getPatientHistory
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;
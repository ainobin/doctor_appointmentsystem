import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import PrescriptionModal from '../../components/PrescriptionModal'
import PatientHistoryModal from '../../components/PatientHistoryModal'

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment, addPrescription, getPatientHistory } = useContext(DoctorContext)
    const { calculateAge, slotDateFormat, currency } = useContext(AppContext)
    
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [patientHistory, setPatientHistory] = useState([])

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    const handleCompleteClick = (appointment) => {
        setSelectedAppointment(appointment)
        setShowPrescriptionModal(true)
    }

    const handleViewHistoryClick = async (appointment) => {
        setSelectedAppointment(appointment)
        const history = await getPatientHistory(appointment.userData._id)
        setPatientHistory(history)
        setShowHistoryModal(true)
    }

    const handleSavePrescription = async (prescriptionData) => {
        const success = await addPrescription(prescriptionData)
        if (success) {
            setShowPrescriptionModal(false)
            setSelectedAppointment(null)
            getAppointments()
        }
    }

    return (
        <div className='w-full max-w-6xl m-5' >
            <p className='mb-3 text-lg font-medium'>All Appointments</p>
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll' >

                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p> Fees</p>
                    <p>Action</p>
                </div>

                {
                    appointments.reverse().map((item, index) => (
                        <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <img className='w-8 rounded-full' src={item.userData.image} alt="" /> 
                                <p 
                                    onClick={() => handleViewHistoryClick(item)}
                                    className='cursor-pointer hover:text-primary hover:underline'
                                    title='View patient history'
                                >
                                    {item.userData.name}
                                </p>
                            </div>
                            <div>
                                <p className='text-xs inline border border-primary px-2 rounded-full'>
                                    {item.payment ? 'Online' : 'CASH'}
                                </p>
                            </div>
                            <p className=' max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                            <p>{currency}{item.amount}</p>
                            {
                                item.cancelled
                                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                    : item.isCompleted
                                        ? <div className='flex flex-col gap-1'>
                                            <p className='text-green-500 text-xs font-medium'>Completed</p>
                                            {item.prescriptionId && (
                                                <button 
                                                    onClick={() => handleViewHistoryClick(item)}
                                                    className='text-xs text-primary hover:underline'
                                                >
                                                    View Prescription
                                                </button>
                                            )}
                                        </div>
                                        : <div className='flex'>
                                            <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                                            <img onClick={() => handleCompleteClick(item)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" title='Complete with prescription' />
                                        </div>
                            }
                        </div>
                    ))
                }
            </div>

            {showPrescriptionModal && selectedAppointment && (
                <PrescriptionModal
                    appointment={selectedAppointment}
                    onClose={() => {
                        setShowPrescriptionModal(false)
                        setSelectedAppointment(null)
                    }}
                    onSave={handleSavePrescription}
                />
            )}

            {showHistoryModal && selectedAppointment && (
                <PatientHistoryModal
                    patient={selectedAppointment.userData}
                    prescriptions={patientHistory}
                    onClose={() => {
                        setShowHistoryModal(false)
                        setSelectedAppointment(null)
                        setPatientHistory([])
                    }}
                />
            )}
        </div>
    )
}

export default DoctorAppointments
import React, { useState } from 'react'
import { assets } from '../assets/assets'

const PrescriptionModal = ({ appointment, onClose, onSave }) => {
    const [diagnosis, setDiagnosis] = useState('')
    const [medications, setMedications] = useState([{ 
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '' 
    }])
    const [instructions, setInstructions] = useState('')
    const [followUpDate, setFollowUpDate] = useState('')

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }])
    }

    const removeMedication = (index) => {
        if (medications.length > 1) {
            const newMedications = medications.filter((_, i) => i !== index)
            setMedications(newMedications)
        }
    }

    const updateMedication = (index, field, value) => {
        const newMedications = [...medications]
        newMedications[index][field] = value
        setMedications(newMedications)
    }

    const handleSubmit = () => {
        // Validate required fields
        if (!diagnosis.trim()) {
            alert('Please enter diagnosis')
            return
        }

        // Validate medications
        for (let med of medications) {
            if (!med.name.trim() || !med.dosage.trim() || !med.frequency.trim() || !med.duration.trim()) {
                alert('Please fill all medication fields')
                return
            }
        }

        onSave({
            appointmentId: appointment._id,
            diagnosis,
            medications,
            instructions,
            followUpDate
        })
    }

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center'>
                    <div>
                        <h2 className='text-xl font-semibold'>Write Prescription</h2>
                        <p className='text-sm text-gray-600'>Patient: {appointment.userData.name}</p>
                    </div>
                    <img 
                        onClick={onClose} 
                        className='w-6 cursor-pointer' 
                        src={assets.cancel_icon} 
                        alt="Close" 
                    />
                </div>

                <div className='p-6 space-y-6'>
                    {/* Diagnosis */}
                    <div>
                        <label className='block text-sm font-medium mb-2'>Diagnosis *</label>
                        <textarea
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className='w-full border rounded px-3 py-2 min-h-[80px]'
                            placeholder='Enter diagnosis...'
                        />
                    </div>

                    {/* Medications */}
                    <div>
                        <div className='flex justify-between items-center mb-2'>
                            <label className='block text-sm font-medium'>Medications *</label>
                            <button
                                onClick={addMedication}
                                className='text-primary text-sm hover:underline'
                            >
                                + Add Medication
                            </button>
                        </div>
                        
                        {medications.map((med, index) => (
                            <div key={index} className='border rounded p-4 mb-3 relative'>
                                {medications.length > 1 && (
                                    <button
                                        onClick={() => removeMedication(index)}
                                        className='absolute top-2 right-2 text-red-500 text-sm'
                                    >
                                        Remove
                                    </button>
                                )}
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='block text-xs text-gray-600 mb-1'>Medicine Name</label>
                                        <input
                                            type='text'
                                            value={med.name}
                                            onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                            className='w-full border rounded px-3 py-2'
                                            placeholder='e.g., Paracetamol'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs text-gray-600 mb-1'>Dosage</label>
                                        <input
                                            type='text'
                                            value={med.dosage}
                                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                            className='w-full border rounded px-3 py-2'
                                            placeholder='e.g., 500mg'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs text-gray-600 mb-1'>Frequency</label>
                                        <input
                                            type='text'
                                            value={med.frequency}
                                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                            className='w-full border rounded px-3 py-2'
                                            placeholder='e.g., 3 times a day'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs text-gray-600 mb-1'>Duration</label>
                                        <input
                                            type='text'
                                            value={med.duration}
                                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                            className='w-full border rounded px-3 py-2'
                                            placeholder='e.g., 5 days'
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className='block text-sm font-medium mb-2'>Additional Instructions</label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className='w-full border rounded px-3 py-2 min-h-[80px]'
                            placeholder='Enter any additional instructions...'
                        />
                    </div>

                    {/* Follow-up Date */}
                    <div>
                        <label className='block text-sm font-medium mb-2'>Follow-up Date</label>
                        <input
                            type='date'
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                            className='border rounded px-3 py-2'
                        />
                    </div>
                </div>

                <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2 border rounded hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark'
                    >
                        Save Prescription
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PrescriptionModal

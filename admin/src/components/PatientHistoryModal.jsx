import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'

const PatientHistoryModal = ({ patient, prescriptions, onClose }) => {
    const [selectedPrescription, setSelectedPrescription] = useState(null)

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col'>
                <div className='border-b px-6 py-4 flex justify-between items-center'>
                    <div>
                        <h2 className='text-xl font-semibold'>Patient History</h2>
                        <p className='text-sm text-gray-600'>Patient: {patient.name}</p>
                    </div>
                    <img 
                        onClick={onClose} 
                        className='w-6 cursor-pointer' 
                        src={assets.cancel_icon} 
                        alt="Close" 
                    />
                </div>

                {prescriptions.length === 0 ? (
                    <div className='flex-1 flex items-center justify-center text-gray-500'>
                        <p>No previous prescriptions found</p>
                    </div>
                ) : (
                    <div className='flex-1 overflow-y-auto p-6'>
                        {selectedPrescription ? (
                            // Detailed prescription view
                            <div>
                                <button
                                    onClick={() => setSelectedPrescription(null)}
                                    className='mb-4 text-primary text-sm hover:underline'
                                >
                                    ← Back to list
                                </button>
                                
                                <div className='border rounded-lg p-6 space-y-4'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h3 className='font-semibold text-lg'>Prescription Details</h3>
                                            <p className='text-sm text-gray-600'>Date: {formatDate(selectedPrescription.date)}</p>
                                        </div>
                                        <button
                                            onClick={() => window.print()}
                                            className='px-4 py-2 border rounded hover:bg-gray-50'
                                        >
                                            Print
                                        </button>
                                    </div>

                                    <div className='border-t pt-4'>
                                        <h4 className='font-semibold mb-2'>Diagnosis</h4>
                                        <p className='text-gray-700'>{selectedPrescription.diagnosis}</p>
                                    </div>

                                    <div className='border-t pt-4'>
                                        <h4 className='font-semibold mb-3'>Medications</h4>
                                        <div className='space-y-3'>
                                            {selectedPrescription.medications.map((med, index) => (
                                                <div key={index} className='bg-gray-50 rounded p-3'>
                                                    <div className='font-medium text-primary'>{med.name}</div>
                                                    <div className='text-sm text-gray-600 mt-1'>
                                                        <span className='mr-4'>Dosage: {med.dosage}</span>
                                                        <span className='mr-4'>Frequency: {med.frequency}</span>
                                                        <span>Duration: {med.duration}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedPrescription.instructions && (
                                        <div className='border-t pt-4'>
                                            <h4 className='font-semibold mb-2'>Additional Instructions</h4>
                                            <p className='text-gray-700'>{selectedPrescription.instructions}</p>
                                        </div>
                                    )}

                                    {selectedPrescription.followUpDate && (
                                        <div className='border-t pt-4'>
                                            <h4 className='font-semibold mb-2'>Follow-up Date</h4>
                                            <p className='text-gray-700'>{formatDate(selectedPrescription.followUpDate)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // List of prescriptions
                            <div className='space-y-3'>
                                <h3 className='font-semibold mb-4'>Previous Prescriptions ({prescriptions.length})</h3>
                                {prescriptions.map((prescription) => (
                                    <div
                                        key={prescription._id}
                                        onClick={() => setSelectedPrescription(prescription)}
                                        className='border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition'
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div className='flex-1'>
                                                <div className='font-semibold text-gray-800'>
                                                    {formatDate(prescription.date)}
                                                </div>
                                                <div className='text-sm text-gray-600 mt-1'>
                                                    Diagnosis: {prescription.diagnosis}
                                                </div>
                                                <div className='text-sm text-gray-500 mt-1'>
                                                    Medications: {prescription.medications.length} prescribed
                                                </div>
                                            </div>
                                            <div className='text-primary text-sm'>
                                                View Details →
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className='border-t px-6 py-4 flex justify-end'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2 border rounded hover:bg-gray-50'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PatientHistoryModal

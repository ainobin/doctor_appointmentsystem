//API for adding doctor
import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import prescriptionModel from "../models/prescriptionModel.js"

const changeAvailability = async (req,res) => {
    try {

        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available })
        res.json({success:true, message: 'Availability Changed'})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const doctorList = async (req,res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true, doctors})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//Api for doctor login
// API for doctor Login
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const docId = req.docId
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}




// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const docId = req.docId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success:true, message: 'Appointment Completed'})

        } else {
            return res.json({success:false, message: 'Mark Failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const docId = req.docId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success:true, message: 'Appointment Cancelled'})

        } else {
            return res.json({success:false, message: 'Cancellation Failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {

    try {

        const docId = req.docId

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {

    try {

        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {

    try {

        const docId = req.docId
        const { fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to add prescription for completed appointment
const addPrescription = async (req, res) => {
    try {
        const docId = req.docId
        const { appointmentId, diagnosis, medications, instructions, followUpDate } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.docId !== docId) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        const prescription = new prescriptionModel({
            appointmentId,
            userId: appointmentData.userId,
            docId,
            patientName: appointmentData.userData.name,
            doctorName: appointmentData.docData.name,
            diagnosis,
            medications,
            instructions,
            followUpDate
        })

        await prescription.save()

        // Update appointment with prescription ID
        await appointmentModel.findByIdAndUpdate(appointmentId, { 
            prescriptionId: prescription._id,
            isCompleted: true 
        })

        res.json({ success: true, message: 'Prescription added successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get patient history (all past prescriptions for a patient)
const getPatientHistory = async (req, res) => {
    try {
        const docId = req.docId
        const { userId } = req.params

        // Verify doctor is viewing their own patient
        const appointments = await appointmentModel.find({ userId, docId })
        
        if (appointments.length === 0) {
            return res.json({ success: false, message: 'Patient not found' })
        }

        // Get all prescriptions for this patient from this doctor
        const prescriptions = await prescriptionModel.find({ userId, docId }).sort({ date: -1 })

        res.json({ success: true, prescriptions })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get prescription by appointment ID
const getPrescriptionByAppointment = async (req, res) => {
    try {
        const docId = req.docId
        const { appointmentId } = req.params

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.docId !== docId) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        if (!appointmentData.prescriptionId) {
            return res.json({ success: false, message: 'No prescription found' })
        }

        const prescription = await prescriptionModel.findById(appointmentData.prescriptionId)

        res.json({ success: true, prescription })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    addPrescription,
    getPatientHistory,
    getPrescriptionByAppointment
}

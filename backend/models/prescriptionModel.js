import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true },
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    diagnosis: { type: String, required: true },
    medications: [{ 
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    instructions: { type: String },
    followUpDate: { type: String }
})

const prescriptionModel = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema)
export default prescriptionModel

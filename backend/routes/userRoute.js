import express from 'express'
import { registerUser,loginUser,getProfile,updateProfile,bookAppointment ,listAppointment,cancelAppointment,submitBkashPayment} from '../controllers/userController.js'
import upload from '../middlewares/multer.js'
import authUser from '../middlewares/authUser.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/submit-bkash-payment',authUser,submitBkashPayment)
export default userRouter
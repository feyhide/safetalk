import express from 'express'
import { signin, signout, signup, verifyOTP} from '../controller/auth.js'

const router = express.Router()

router.post("/sign-up",signup)
router.post("/sign-in",signin)
router.post("/verify-otp",verifyOTP)
router.get("/sign-out",signout)

export default router
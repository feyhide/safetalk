import express from 'express'
import { searchContacts } from '../controller/user.js'
import { verifyToken } from '../utils/verify_user.js'

const router = express.Router()

router.post("/search-users",verifyToken,searchContacts)

export default router
import express from 'express'
import { streamLongText } from '../controllers/text.controller'

const router = express.Router()

router.get('/longtext', streamLongText)

export default router

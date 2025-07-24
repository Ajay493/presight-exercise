import express from 'express'
import { getPeople } from '../controllers/people.controller'

const router = express.Router()

router.get('/people', getPeople)

export default router

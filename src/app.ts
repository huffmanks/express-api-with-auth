import 'dotenv/config'

import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import config from './config'
import connectToDB from './utils/connectToDB'
import router from './routes'

const app = express()

app.use(json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)

app.listen(config.port || 5000, async () => {
    await connectToDB()
    console.log('Server is running on http://localhost:' + config.port)
})

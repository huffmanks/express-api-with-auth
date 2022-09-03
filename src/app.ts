import 'dotenv/config'

import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectToDB from './utils/connectToDB'
import router from './routes'

const port = process.env.PORT

const app = express()

app.use(json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)

app.listen(port || 5000, async () => {
    await connectToDB()
    console.log('Server is running on http://localhost:' + port)
})

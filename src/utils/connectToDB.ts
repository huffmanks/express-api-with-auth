import mongoose from 'mongoose'

import config from '../config'

export default async function () {
    try {
        await mongoose.connect(config.dbUri)
        console.log('Connected to MongoDB')
    } catch (e) {
        process.exit(1)
    }
}

import mongoose from 'mongoose'

export default async function () {
    const dbUri = process.env.DB_URI as string

    try {
        await mongoose.connect(dbUri)
        console.log('Connected to MongoDB')
    } catch (e) {
        process.exit(1)
    }
}

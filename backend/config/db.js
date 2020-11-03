import mongoose from 'mongoose'
import colors from 'colors'


const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
           
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
           
          
        })

        console.log(`DB connected: ${conn.connection.host}`.underline.grey)

    } catch (error) {
        console.log(process.env.MONGO_URI)
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB;
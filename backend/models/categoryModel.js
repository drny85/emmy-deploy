import mongoose from 'mongoose'

const categorySchema = mongoose.Schema({
    name: { type: String, required: [true, 'name is required'], lowercase: true },
    
})

export default mongoose.model('Category', categorySchema)
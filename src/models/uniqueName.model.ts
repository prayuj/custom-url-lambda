import mongoose from 'mongoose';

const uniqueNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
})

const uniqueName = mongoose.model('uniqueName', uniqueNameSchema)
export default uniqueName;
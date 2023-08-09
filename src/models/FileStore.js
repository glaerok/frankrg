import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const FileStore = new Schema({
    createdAt: { type: Date, default: Date.now },
    fileName: {
        type: String,
        unique: false,
        required: true,
    },

    mimeType: {
        type: String,
        unique: false,
        required: false,
    },
    size: {
        type: Number,
        unique: false,
        required: true,
    },
    md5:{
        type: String,
        unique: false,
        required: false,
    },
    private: {
        type: Boolean,
        unique: false,
        required: false,
    },
    enabled: {
        type: Boolean,
        unique: false,
        required: false,
    },
    description: {
        type: String,
        unique: false,
        required: false,
    }
});

export default mongoose.model("FileStore", FileStore);

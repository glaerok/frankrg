import mongoose from 'mongoose';
import { FilesLinks, LangDocsContent } from './CommonModels.js';

const Schema = mongoose.Schema;

const FileDocs = new Schema({
    name: {
        type: String,
        default: '',
        required: false,
    },
    link: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    showArchive: {
        type: Boolean,
        default: false,
    },
    section: {
        type: String,
        default: 'public',
    },
    files: {
        type: [FilesLinks],
    },
    perm: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ru: {
        type: LangDocsContent,
    },
    en: {
        type: LangDocsContent,
    },
});

export default mongoose.model('FileDocs', FileDocs);

import express from 'express';
import { getFile, saveFile, listFiles, removeFile, editFile } from '../controllers/filesController.js';

const router = express.Router();

router.post('/upload', saveFile);
router.post('/remove', removeFile);
router.post('/edit', editFile);
router.get('/list', listFiles);
router.get('/:fileId', getFile);

export default router;

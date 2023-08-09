import * as fs from 'fs';
import FileStore from '../models/FileStore.js';

import { FILESTORE_PATH } from '../app/config/consts.js';

export const getFile = async (req, res) => {
    const found = await FileStore.findOne({ _id: req.params.fileId });
    if (!found) {
        res.status(404).send({ error: 'file not found' });
    } else {
        const path = FILESTORE_PATH + found.id;
        fs.readFile(path, 'binary', (error, file) => {
            if (error) res.json({ error });
            else {
                res.setHeader('Content-Length', found.size);
                res.setHeader('Content-Type', found.mimeType);
                res.setHeader('Content-Disposition', 'inline; filename=' + found.fileName);
                res.write(file, 'binary');
                res.end();
            }
        });
    }
};

export const removeFile = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).send({ error: 'id required' });
    }

    // fs.unlink(__dirname + '/../files/' + id, async (error) => {
    fs.unlink(FILESTORE_PATH + id, async (error) => {
        if (error) console.log(error);
    });
    await FileStore.find({ _id: id }).deleteOne();
    res.json({ status: 'Deleted', id });
};

export const editFile = async (req, res) => {
    const { id } = req.body;
    const { fileName } = req.body;
    if (!id) {
        res.status(400).send({ error: 'id required' });
    }
    fs.unlink(FILESTORE_PATH + id, async (error) => {
        if (error) console.log(error);
    });
    await FileStore.updateOne({ _id: id }, { fileName: fileName })
    res.json({ status: 'Edited', id });
};

export const listFiles = (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 20
    };

    if (req.query.page) {

        FileStore.find()
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit)
            .exec(function (err, doc) {
                if (err) { res.status(500).json(err); return; }
                res.status(200).json(doc);
            });

    } else {
        FileStore.find({}, function (err, files) {
            if (err) { res.json(err); }
            res.json(files);
        });
    }
};

export const saveFile = async (req, res, next) => {

    let uploadFile;
    const filesLength = Object.keys(req.files).length;
    const uploaded = [];

    if (!req.files || filesLength === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    for (let i = 0; i < filesLength; i++) {
        uploadFile = req.files[`uploadFile_${i}`];

        try {
            decodeURIComponent(uploadFile.name);
        } catch (e) {
            return res.status(400).send({ type: 'error', text: 'Too long filename' });
        }

        try {
            const storedFile = await FileStore.create({
                fileName: uploadFile.name,
                mimeType: uploadFile.mimetype,
                md5: uploadFile.md5,
                size: uploadFile.size,
                private: false,
                enabled: true,
                description: '',
            });

            // await uploadFile.mv(__dirname + '/../files/' + storedFile._id);
            console.log('move', FILESTORE_PATH + storedFile._id);
            await uploadFile.mv(FILESTORE_PATH + storedFile._id);
            uploaded.push(storedFile);
        } catch (err) {
            console.log('error', err);
            if (err)
                console.log('error', err);
            return res.status(500).send(err);
        }

    }
    res.json({ done: uploaded });
    next();
};

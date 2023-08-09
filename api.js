import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import filesRouter from './src/routes/filesRoutes.js';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import { setDefaultHeaders } from './src/app/helpers/index.js';

import { CORS_OPTIONS, UPLOAD_OPTIONS, CORS_FILESTORE } from './src/app/config/consts.js';
import morgan from 'morgan';
import { readFile } from 'fs/promises';

const pjson = JSON.parse(
    await readFile(
        new URL('./package.json', import.meta.url)
    )
);
const api = express();
if (process.env.NODE_ENV === 'production') {
    api.use(setDefaultHeaders);
}
console.log('Starting in', process.env.NODE_ENV, 'mode');
api.use(bodyParser.json());
api.use(cookieParser(process.env.COOKIE_SECRET));
api.use(cors(CORS_OPTIONS));
api.use(fileUpload(UPLOAD_OPTIONS));
api.use(morgan('dev'));
api.use(passport.initialize());

api.use('/files', cors(CORS_FILESTORE), filesRouter);


console.log('API version:', pjson.version);
api.get('/', function (req, res) {
    res.send({ version: pjson.version, status: 'Ok' });
});

const server = api.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log('App started at port:', port);

    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
        auth: { authSource: 'admin' },
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PWD,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('Database connected.'))
        .catch(err => console.log(err));
});

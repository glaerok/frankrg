import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const devPath = __dirname + '/../../../files/';

export const dev = process.env.NODE_ENV !== 'production';
export const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];
export const COLLECTION_NAME = process.env.MONGO_DB_CONNECTION_STRING?.split('/')[3];
export const FILESTORE_PATH = dev ? devPath : process.env.FILESTORE_PATH + '/';
export const SYSTEM_LANGUAGES_LIST = ['ru', 'en'];

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: !dev,                                           // Since localhost is not having https protocol, secure cookies does not work correctly (in postman)
    signed: true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
    // sameSite: dev ? 'Lax' : 'none',
    sameSite: 'Lax',
};

export const CORS_OPTIONS = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },

    credentials: true,
};

export const CORS_FILESTORE = {
    origin: function(origin, callback) {
        callback(null, true);
    },
    // credentials: true,
};

export const UPLOAD_OPTIONS = {
    limits: { fileSize: 16 * 1024 * 1024 },
};

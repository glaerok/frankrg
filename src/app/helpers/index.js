
export function setDefaultHeaders(req, res, next) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
}

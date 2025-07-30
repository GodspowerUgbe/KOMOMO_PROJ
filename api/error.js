const {
    readFileSync
} = require('fs');
const path = require('path');

const serverErrHandler = (err, req, res, next) => {
    console.log('server error caught')
    console.error(err);//log error to file
    res.status(500).send('Server Error');
}

const error404 = (err,req,res,next) => {
    console.log('error 404 caught')
    console.error(err);
    res.status(404).sendFile(path.join(__dirname, '..', '..', 'frontend', 'pages', '404.html'));
}

module.exports = {
    serverErrHandler,
    error404
};
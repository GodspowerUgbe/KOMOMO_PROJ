const { createWriteStream,
    statSync,
    existsSync,
    writeFileSync
} = require('fs');

const path = require('path');

const reqLog = (req, res, next) => {
    let data = {
        url: req.url || "unknown url",
        time: new Date().toString(),
        client: req.ip,
        method:req.method
    };
    let filePath = path.join(__dirname, '..', 'logs', 'logs.json');
    let success,size=statSync(filePath).size;

    if (!existsSync(filePath)) writeFileSync(filePath,'');

    try {
        const writeStream = createWriteStream(filePath, {
            start: size,
            flags: 'a'
        });
        writeStream.write(`${size < 1 ? '' : ','}${JSON.stringify(data)}`);
        writeStream.end();
    } catch (err) {
        success = false
        console.error(err);
    } finally {
        if (success) console.log('request logged');
        next();
    }

    

}

module.exports = {
    reqLog
}
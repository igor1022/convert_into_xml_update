const fs = require('fs');
const { log, error } = require('./logger');

async function deleteTempFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                error(`Error deleting temp file: ${err}`);
                reject(err);
            } else {
                log(`Deleted: ${filePath}`);
                resolve();
            }
        });
    });
}

module.exports = { deleteTempFile };

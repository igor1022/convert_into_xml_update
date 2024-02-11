const fs = require('fs');
const axios = require('axios');
const path = require('path');
const {bot} = require('./bot');
const { log, error } = require('./logger');

async function downloadFile(fileId, fileName) {
    try {
        const fileLink = await bot.getFileLink(fileId);
        const response = await axios({
            method: 'get',
            url: fileLink,
            responseType: 'arraybuffer'
        });

        const tempFilePath = path.join(__dirname, `${Date.now()}_${fileName}`);
        fs.writeFileSync(tempFilePath, response.data);

        return tempFilePath;
    } catch (err) {
        error(`Error downloading file: ${err}`);
        throw error;
    }
}

module.exports = { downloadFile };

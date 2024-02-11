const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { log, error } = require('./logger');
const { convertExcelToXmlAndSave } = require('./excelConverter');
const { downloadFile } = require('./fileDownloader');
const { deleteTempFile } = require('./tempFileManager');
const { bot } = require('./bot');

async function handleMessage(msg) {
    log(`Received document: ${JSON.stringify(msg.document)}`);
    if (!msg.document || !msg.document.file_id) {
        error('No document found');
        return;
    }
    const fileId = msg.document.file_id;
    const fileName = msg.document.file_name;

    try {
        const tempFilePath = await downloadFile(fileId, fileName);

        if (path.extname(tempFilePath) !== '.xls' && path.extname(tempFilePath) !== '.xlsx') {
            await deleteTempFile(tempFilePath);
            error('Error: Unsupported file extension!');
            return;
        }

        const xmlFilePath = await convertExcelToXmlAndSave(tempFilePath);

        await deleteTempFile(tempFilePath);

        if (xmlFilePath) {
            await bot.sendDocument(msg.chat.id, xmlFilePath, { caption: 'Converted XML file' });
            log('File successfully converted and sent');
            await deleteTempFile(xmlFilePath);
        } else {
            error('Error converting file to XML');
        }
    } catch (err) {
        error(`Error processing document: ${err}`);
    }
}

bot.on('document', handleMessage);

module.exports = { handleMessage };

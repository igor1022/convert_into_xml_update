const xlsx = require('xlsx');
const xmlbuilder = require('xmlbuilder');
const path = require('path');
const fs = require('fs');
const { log, error } = require('./logger');

async function convertExcelToXmlAndSave(filePath) {
    return new Promise((resolve, reject) => {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        const root = xmlbuilder.create('TgMall');

        jsonData.forEach(row => {
            const entry = root.ele('products');
            Object.keys(row).forEach(key => {
                const englishKey = key.replace(/[^a-zA-Z0-9]/g, '_');
                entry.ele(englishKey, row[key]);
            });
        });

        const xmlString = root.end({ pretty: true });
        const xmlFileName = `${Date.now()}_converted.xml`;
        const xmlFilePath = path.join(__dirname, xmlFileName);

        const xmlWithoutHeader = xmlString.replace(/<\?xml.*\?>\n/, '');

        fs.writeFile(xmlFilePath, xmlWithoutHeader, (err) => {
            if (err) {
                error(`Error saving XML file: ${err}`);
                reject(err);
            } else {
                resolve(xmlFilePath);
            }
        });
    });
}

module.exports = { convertExcelToXmlAndSave };

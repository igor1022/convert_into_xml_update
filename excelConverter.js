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

        // Создаем пустой объект для хранения данных столбцов
        const columnValues = {};

        // Проходимся по каждой ячейке в листе Excel
        const range = xlsx.utils.decode_range(sheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = { c: C, r: R };
                const cellRef = xlsx.utils.encode_cell(cellAddress);
                const cell = sheet[cellRef];
                if (cell) {
                    // Получаем имя столбца и имя колонки
                    const columnName = xlsx.utils.encode_col(C);
                    const columnHeader = cell.v;

                    // Извлекаем значение ячейки
                    const cellValue = cell.v;

                    // Инициализируем массив значений для столбца, если это первый раз встречаем столбец
                    if (!columnValues[columnName]) {
                        columnValues[columnName] = { column: columnHeader, values: [] };
                    }
                    // Добавляем значение в массив для данного столбца
                    columnValues[columnName].values.push(cellValue);
                }
            }
        }

        // Создаем XML
        const root = xmlbuilder.create('TgMall');
        const columnNames = Object.keys(columnValues);
        const rowCount = columnValues[columnNames[0]].values.length;
        for (let i = 0; i < rowCount; i++) {
            if (i === 0) continue; // Пропускаем первую итерацию для пропуска первого тега <products> с описанием
            const entry = root.ele('products');
            columnNames.forEach(columnName => {
                const value = columnValues[columnName].values[i];
                const columnHeader = columnValues[columnName].column;
                entry.ele(columnHeader, value);
            });
        }

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

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const token = config.token;

const bot = new TelegramBot(token, { polling: true });

module.exports = {bot}
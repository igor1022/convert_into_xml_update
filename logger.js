const config = require('./config');
const { bot } = require('./bot');

function log(message) {
    bot.sendMessage(config.channelUsername, message);
}

function error(message) {
    bot.sendMessage(config.channelUsername, `Error: ${message}`);
}

module.exports = { log, error };

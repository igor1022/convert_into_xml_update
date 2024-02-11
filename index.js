const { handleMessage } = require('./messageHandler');
const { bot } = require('./bot');

// Make sure handleMessage is registered only once
bot.off('document', handleMessage); // Unregister existing listener
bot.on('document', handleMessage);  // Register the listener

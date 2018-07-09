const config = {
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
};

if (!config.DB_USERNAME || !config.DB_PASSWORD) throw new Error('no db config');
if (!config.TELEGRAM_BOT_TOKEN) throw new Error('no telegram bot token');

module.exports = config;
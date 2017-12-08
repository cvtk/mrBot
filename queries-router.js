const bot = require('./init/bot.js');
const db = require('./init/db.js');

module.exports = function queriesRouter(callbackQuery) {
  console.log(callbackQuery);
  const msg = callbackQuery.message,
        chat_id = msg.chat.id,
        message_id = msg.message_id;

  options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: 'Контакт', callback_data: 'new_contact' },
        { text: 'Задачу', callback_data: 'new_task' },
        { text: 'Компанию', callback_data: 'new_company' }
      ]]
    })
  }
  //console.log(options)
  bot.editMessageReplyMarkup(options.reply_markup, { chat_id, message_id })
  //bot.editMessageText('asdasdasdasdasd', options);
}
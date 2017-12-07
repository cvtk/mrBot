const bot = require('./init/bot.js');
const db = require('./init/db.js');

module.exports = function queriesRouter(callbackQuery) {
  const msg = callbackQuery.message;
  options = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: 'Контакт', callback_data: 'new_contact' },
        { text: 'Задачу', callback_data: 'new_task' },
        { text: 'Компанию', callback_data: 'new_company' }
      ]]
    })
  }
  //console.log(options)
  //bot.editMessageReplyMarkup(options)
  bot.editMessageText('asdasdasdasdasd', options);
}
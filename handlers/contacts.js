'use strict'

const bot = require('../init/bot.js');
const db = require('../init/db.js');
const state = require('../init/state.js');

const _arrToChunks = function(arr, col) {
  let result = [];
  while (arr.length) {
    result.push( arr.splice(0, col) );
  }

  return result;
};

const _objToButton = function(obj, opt) {
  if ( typeof obj[opt.idField] === 'undefined' || typeof opt.cbPrefix === 'undefined' ) return false;

  const text = obj[opt.nameField] || 'Button',
        callback_data = `${ opt.cbPrefix }__${ obj[opt.idField] }`;

  return { text, callback_data };
};

const _cntToStr = function(contacts) {
  return contacts.reduce( (res, contact) => {
    //res += `<a href="t.me/digitYar_bot?contacts=${ contact }">${ contact }</a>`;
    res += `${ contact }, `;
    return res;
  }, '')
}

const needContactsList = function(args) {
  return args.length === 1;
};

const detailView = function(msg, contactId, isQueryCallback) {
  if ( typeof contactId === 'undefined' ) return;

  const chat_id = msg.chat.id,
        message_id = msg.message_id,
        opt = {}

  let buttons = [
    { text: 'Рабочий тел.', callback_data: `edit_contact_phone__${ contactId }` },
    { text: 'Личный тел.', callback_data: `edit_contact_mobile__${ contactId }` },
    { text: 'Заметка', callback_data: `edit_contact_note__${ contactId }` },
    { text: 'Удалить', callback_data: `remove_contact_confirm__${ contactId }` }],
      opt = { parse_mode: 'html' }

  const contact = db.get('contacts').find({ id: contactId }).value();
  const message = `Сделай ему предложение, от которого он не сможет отказаться\n<strong>Имя:</strong> ${ contact.name }\n<strong>Рабочий:</strong> ${ contact.phone || '\uD83D\uDEAB' }\n<strong>Личный:</strong> ${ contact.mobile || '\uD83D\uDEAB' }\n${ contact.note? '<pre>' + contact.note + '</pre>': '' }`;

  if ( isQueryCallback ) {
    buttons.push( { text: '« Контакты', callback_data: 'view_contacts' } );
    opt.reply_markup = JSON.stringify({ inline_keyboard: _arrToChunks(buttons, 2) });
    bot.editMessageReplyMarkup(opt.reply_markup, { chat_id, message_id });
  }
  else {
    opt.reply_markup = JSON.stringify({ inline_keyboard: _arrToChunks(buttons, 2) });
    bot.sendMessage(chatId, message, opt );
  }
}

const listView = function(msg, page) {
  const chatId = msg.chat.id,
        from = msg.from,
        limit = 6;

  let options = { parse_mode: 'html' };

  const contacts = db.get('contacts').value();

  if ( contacts.length ) {
    const buttonOpt = {
      nameField: 'name',
      cbPrefix: 'detail_contact',
      idField: 'id'
    };

    const buttons = contacts
      .map( contact => _objToButton( contact, buttonOpt ) )
        .slice(0, limit);

    if ( contacts.length > limit ) {
      buttons.push(
        { text: '« Назад', callback_data: 'contacts_list_prev' },
        { text: 'Вперед »', callback_data: 'contacts_list_next' }
      )
    }

    options.reply_markup = JSON.stringify({
      inline_keyboard: _arrToChunks(buttons, 2)
    });

    bot.sendMessage(chatId, `Держи друзей близко, а врагов еще ближе`, options);
  }
  else {
    bot.sendMessage(chatId, `${ from.first_name }, в твоем списке <strong>нет никого</strong>, кто считал бы тебя своим другом`, options);
  }
};

module.exports = function contactsHandler(msg, query, isQueryCallback) {
  if ( query.action === 'list' ) return listView(msg, 1);
}
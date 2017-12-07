#!/usr/bin/env nodejs

'use strict'

const handlersRouter = require('./handlers-router.js');
const queriesRouter = require('./queries-router.js');
const bot = require('./init/bot.js');
const _re = require('./helpers/regexp.js');
const _id = require('shortid');

function _unixDate() {
  return Math.floor(Date.now() / 1000);
};

function createContact(name) {
  const contact = {
      id: _id.generate(),
      created: _unixDate(),
      name: name
    }
    db.get('contacts').push(contact).write();
    return contact.id;
};

function contactsHandler(msg, args) {
  const chatId = msg.chat.id,
        options = { parse_mode: 'html' };
  console.log(args)

  if ( args[3].match(/(new|нов|yjd|туц|\+|cre|cjp|соз|ску|add|доб|lj,|фвв)\S*/i) ) {
    bot.sendMessage(chatId, 'Просто <strong>назови имя</strong> этого человека, о нем позаботятся',  options )
      .then( data => state.setCurrent(data.chat.id, 'new_contact_name'));
  }
};

function removeContactConfirmHandler(msg, contactId) {
  const chatId = msg.chat.id;
  const opt = {
    parse_mode: 'html',
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: '\u2757 Я уверен, что хочу удалить', callback_data: `remove_contact__${ contactId }` }
      ]],
    })
  };
  bot.sendMessage(chatId, `Я не люблю насилие, ${ msg.chat.first_name }. Я бизнесмен. Кровь — непозволительная роскошь`, opt );
};

function removeContactHandler(msg, contactId) {
  const chatId = msg.chat.id;
  const contact = db.get('contacts').find({ id: contactId }).value();
  if ( !contact ) return;
  db.get('contacts').remove({ id: contactId }).write();
  bot.sendMessage(chatId, `\uD83D\uDC1F Это сицилийский знак. Он означает, что ${ contact.name } кормит рыб на дне океана` );
}

function editContactHandler(msg, contactId) {
  const chatId = msg.chat.id;
  const opt = {
    parse_mode: 'html',
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: 'Рабочий тел.', callback_data: `edit_contact_phone__${ contactId }` },
        { text: 'Личный тел.', callback_data: `edit_contact_mobile__${ contactId }` }],
        [{ text: 'Заметка', callback_data: `edit_contact_note__${ contactId }` },
        { text: 'Удалить', callback_data: `remove_contact_confirm__${ contactId }` }]]
    })
  };
  const contact = db.get('contacts').find({ id: contactId }).value();
  const message = `Сделай ему предложение, от которого он не сможет отказаться\n<strong>Имя:</strong> ${ contact.name }\n<strong>Рабочий:</strong> ${ contact.phone || '\uD83D\uDEAB' }\n<strong>Личный:</strong> ${ contact.mobile || '\uD83D\uDEAB' }\n${ contact.note? '<pre>' + contact.note + '</pre>': '' }`;
  bot.sendMessage(chatId, message, opt );
};

function createContactWNameHandler(msg, args) {
  const userId = msg.from.id,
        name = args[args.length - 1];
  console.log(name);

  const contactId = createContact(name);
  editContactHandler(msg, contactId);
};

function createContactHandler(msg, args) {
  const chatId = msg.chat.id, opt = { parse_mode: 'html' };
  bot.sendMessage(chatId, 'Просто <strong>назови имя</strong> этого человека и о нем позаботятся',  opt )
      .then( data => state.setCurrent(data.chat.id, 'new_contact_name'));
}

function createHandler(msg, args) {
  const chatId = msg.chat.id,
        arg = args[2],
        opt = {
          parse_mode: 'html',
          reply_markup: JSON.stringify({
            inline_keyboard: [[
              { text: 'Контакт', callback_data: 'new_contact' },
              { text: 'Задачу', callback_data: 'new_task' },
              { text: 'Компанию', callback_data: 'new_company' }
            ]]
          })
        }

  bot.sendMessage(chatId, 'Друг мой, что я могу <strong>сделать</strong> для тебя?', opt);
};

function requestsHandler(msg) {
  const userId = msg.from.id;
  if ( state.getCurrent(userId) === 'new_contact_name') {
    const contactId = createContact(msg.text);
    state.setCurrent(userId) === '';
    editContactHandler(msg, contactId);
  }
};

function callbackQueryHandler(msg) {
  //const [ type, objectId ] = msg.data.split('__');
  const type = msg.data.split('__')[0];
  const objectId = msg.data.split('__')[1];
  switch( type ) {
    case 'new_contact': createContactHandler(msg.message); break;
    case 'remove_contact_confirm': removeContactConfirmHandler(msg.message, objectId); break;
    case 'remove_contact': removeContactHandler(msg.message, objectId); break;
    //case 'edit_contact_phone': createContactHandler(msg.message); break;
    //case 'edit_contact_mobile': createContactHandler(msg.message); break;
    //case 'edit_contact_note': createContactHandler(msg.message); break;
  }
};

// bot.onText(/(\/|\.)(con|кон|rjy|сщт)\S*(.*)/i, contactsHandler );
// bot.onText( _re(['create']), createHandler );
// bot.onText( _re(['create', 'sp', 'contact']), createContactHandler );
// bot.onText( _re(['create', 'sp', 'contact', 'sp', 'name']), createContactWNameHandler );
// bot.on( 'message', requestsHandler );
// bot.on( 'callback_query', callbackQueryHandler );

bot.on( 'message', handlersRouter );
bot.on( 'callback_query', queriesRouter );
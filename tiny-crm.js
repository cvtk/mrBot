#!/usr/bin/env nodejs

'use strict'

const cfg = require('./config.json');

const Bot = require('node-telegram-bot-api');
const bot = new Bot( cfg['telegram-token'], { polling: true } );

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low( new FileSync(cfg['db-file']) );

const _re = require('./helpers/regexp.js');
const _id = require('shortid');
const State = require('./helpers/state.js');

let state = new State();

//db.defaults({ contacts: [] }).write();

function _unixDate() {
  return Math.floor(Date.now() / 1000);
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

function editContactHandler(msg, contactId) {
  const chatId = msg.chat.id, userId = msg.from.id;
  const opt = {
    parse_mode: 'html',
    reply_markup: JSON.stringify({
      inline_keyboard: [[
        { text: 'Рабочий тел.', callback_data: 'edit_contact_phone' },
        { text: 'Мобильный тел.', callback_data: 'edit_contact_mobile' },
        { text: 'Заметка', callback_data: 'edit_contact_note' }
      ]]
    })
  };
  state.setCurrent(userId) === 'edit_contact'
  const contact = db.get('contacts').find({ id: contactId }).value();
  const message = `Сделайте ему предложение, от которого он не сможет отказаться.\n<strong>Имя:</strong><i>${ contact.name }</i>\n<strong>Рабочий:</strong> <i>${ contact.phone || 'нет' }</i>\n<strong>Мобильный:</strong> <i>${ contact.mobile || 'нет' }</i>\n<pre>${ contact.note || 'нет заметок' }</pre>`;
  bot.sendMessage(chatId, message, opt );
}

function createContactHandler(msg, args) {
  const chatId = msg.chat.id, opt = { parse_mode: 'html' };
  bot.sendMessage(chatId, 'Просто <strong>назови имя</strong> этого человека, о нем позаботятся',  opt )
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
  console.log(msg);
  if ( state.getCurrent(userId) === 'new_contact_name') {
    const contact = {
      id: _id.generate(),
      created: _unixDate(),
      name: msg.text
    }
    db.get('contacts').push(contact).write();
    editContactHandler(msg, contact.id);
  }
};

function callbackQueryHandler(msg) {
  if ( msg.data === 'new_contact') { createContactHandler(msg.message) }
};

bot.onText(/(\/|\.)(con|кон|rjy|сщт)\S*(.*)/i, contactsHandler );
bot.onText( _re(['create']), createHandler );
bot.onText( _re(['create', 'sp', 'contact']), createContactHandler );
bot.on( 'message', requestsHandler );
bot.on( 'callback_query', callbackQueryHandler );

#!/usr/bin/env nodejs

'use strict'

const cfg = require('./config.json');

const Bot = require('node-telegram-bot-api');
const bot = new Bot( cfg['telegram-token'], { polling: true } );

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low( new FileSync(cfg['db-file']) );

const _id = require('shortid');

// bot.onText(/\/(con|кон|rjy|сщт)\S* (.+)/, (msg, match) => {

// 	const chatId = msg.chat.id,
// 				arg = match[2];
// 	let resp = '';

// 	switch(arg) {
// 		case '+': resp = '<strong>Создание нового</strong> контакта'; break;
// 		default: resp = '<strong>Что-то</strong> другое';
// 	}

// 	bot.sendMessage(chatId, resp, { parse_mode: 'html' });
// });

bot.onText(/(\/|\.)(new|нов|yjd|туц)\S* (.+)/, (msg, match) => {
	const chatId = msg.chat.id,
				arg = match[2],
				opt = {
					parse_mode: 'html',
					reply_markup: JSON.stringify({
						inline_keyboard: [
							[{ text: 'Контакт', callback_data: '1_1' }],
							[{ text: 'Задачу', callback_data: '1_2' }],
							[{ text: 'Компанию', callback_data: '1_3' }]
						]
					})
				}

	bot.sendMessage(chatId, 'Что требуется <strong>создать</strong>?', opt);
});

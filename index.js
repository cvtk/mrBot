#!/usr/bin/env nodejs

'use strict'

const express = require('express');
const Bot = require('node-telegram-bot-api');
const R = require('ramda');

const app = express();
const bot = new Bot( '462050712:AAFUu-f72XZ2tYwsQeSuLNUFAbNoB7O7prU', { polling: true } );
const chatId = '-294390961';
const token = '5274ygs1BFVps9w37F8B';

function isForbiddenRequest(tkn) {
  return R.isEmpty(tkn) || R.isNil(tkn) || tkn !== token;
};

function formatLink(text, link) {
  return `<a href="${link}">${text}</a>`;
}

app.get('/incoming-call', function (req, res) {
  let q = req.query;
  if ( isForbiddenRequest(q.token) ) {
    res.status(403).json( { err: 'forbidden, no valid token' } );
    return;
  };

  if ( R.isEmpty(q.contactName) || R.isNil(q.contactName) ) {
    res.status(500).json( { err: 'contactName varible is empty' } );
    return;
  };

  if ( R.isEmpty(q.contactLink) || R.isNil(q.contactLink) ) {
    res.status(500).json( { err: 'contactLink varible is empty' } );
    return;
  };

  res.status(200).json('200');
  bot.sendMessage(chatId, `<strong>Входящий</strong> звонок от  ${ formatLink(q.contactName, q.contactLink) } ...`, { parse_mode: 'html' } );
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
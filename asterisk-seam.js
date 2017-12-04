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
  return R.isEmpty(tkn) || tkn !== token;
};

function _a(text, link) {
  return `<a href="${link}">${text}</a>`;
};

function _b(text) {
  return `<strong>${text}</strong>`;
}

app.get('/incoming-call', function (req, res) {
  let q = req.query;
  if ( isForbiddenRequest(q.token) ) {
    res.status(403).json( { err: 'forbidden, no valid token' } );
    return;
  };

  if ( R.isEmpty(q.phoneNumber) ) {
    res.status(500).json( { err: 'phoneNumber varible is empty' } );
    return;
  };

  if ( R.isEmpty(q.callId) ) {
    res.status(500).json( { err: 'callId varible is empty' } );
    return;
  };

  res.status(200).json('200');
  bot.sendMessage(chatId, `${ _b('Входящий') } звонок от  ${ _a(q.contactName, q.contactLink) } ...`, { parse_mode: 'html' } );
});

app.listen(3000);
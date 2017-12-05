#!/usr/bin/env nodejs

'use strict'

const express = require('express');
const Bot = require('node-telegram-bot-api');
const R = require('ramda');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low( new FileSync('db.json') );

const app = express();
//const bot = new Bot( '462050712:AAFUu-f72XZ2tYwsQeSuLNUFAbNoB7O7prU', { polling: true } );
const chatId = '-294390961';
const token = '5274ygs1BFVps9w37F8B';

const _html = {
  a: function (text, link) {
    return `<a href="${link}">${text}</a>`;
  },
  b: function(text) {
    return `<strong>${text}</strong>`;
  }
}

function isForbiddenRequest(tkn) {
  return R.isEmpty(tkn) || tkn !== token;
};

function _strToPhone(str) {
  return str.replace(/\D/g,'').slice(-10);
};

function _phoneToStr(phn) {
  if ( typeof(phn) === 'undefined' ) return;
  switch(phn.length) {
    case 5: return phn.replace(/(\d{1})(\d{2})(\d{2})/, "$1-$2-$3");
    case 6: return phn.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
    case 7: return phn.replace(/(\d{3})(\d{2})(\d{2})/, "$1-$2-$3");
    case 10: return phn.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "($1) $2-$3-$4");
    default: return phn;
  }
};

function _unixDate() {
  return Math.floor(Date.now() / 1000);
};

function _salt() {
  let now = new Date(),
      startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return (startOfDay / 1000).toString;
};

function _id(str, salt) {
  let hash = 0, i, chr;

  str += salt;
  
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

app.get('/incoming-call', function (req, res) {
  let q = req.query,
      call = {};

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

  call = {
    from: _strToPhone(q.phoneNumber),
    id: _id( q.callId, _salt() ),
    created: _unixDate(),
    startAt: '',
    endAt: '',
    to: ''
  };

  db.defaults({ calls: [] }).write();

  db.get('calls').push(call).write();

  res.status(200).json('200');
  //bot.sendMessage(chatId, `${ _html.b('Входящий') } звонок от  ${ _html.a(call.from, 'http:/770760.ru') } ...`, { parse_mode: 'html' } );
});

app.listen(3000);
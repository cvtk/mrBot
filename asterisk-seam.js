#!/usr/bin/env nodejs

'use strict'

const express = require('express');
const Bot = require('node-telegram-bot-api');
const R = require('ramda');
const _id = require('shortid');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low( new FileSync('db.json') );

const app = express();
const bot = new Bot( '462050712:AAFUu-f72XZ2tYwsQeSuLNUFAbNoB7O7prU', { polling: true } );
const chatId = '-294390961';
const token = '5274ygs1BFVps9w37F8B';

let currentCalls = {};

const _html = {
  a: function(text, link) {
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
  return str.toString().replace(/\D/g,'').slice(-10);
};

function _phoneToStr(phn) {
  if ( typeof(phn) === 'undefined' ) return;
  if ( phn.length === 10 && phn.slice(0, 4) == '4852' ) {
    return phn.slice(-6).replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
  } else if ( phn.length === 10 ) {
    return phn.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "($1) $2-$3-$4");
  } else return phn;
}

function _unixDate() {
  return Math.floor(Date.now() / 1000);
};


app.get('/incoming-call', function (req, res) {
  let q = req.query, call = {}, message = '',
      options = { parse_mode: 'html' }

  if ( isForbiddenRequest(q.token) ) {
    res.status(403).json( { err: 'forbidden, no valid token' } );
    return;
  };

  if ( R.isEmpty(q.phone) ) {
    res.status(500).json( { err: 'phoneNumber varible is empty' } );
    return;
  };

  if ( R.isEmpty(q.id) ) {
    res.status(500).json( { err: 'callId varible is empty' } );
    return;
  };

  call = {
    from: _strToPhone(q.phone),
    id: _id.generate(),
    created: _unixDate(),
    startAt: '',
    endAt: '',
    to: ''
  };

  db.defaults({ calls: [] }).write();
  db.get('calls').push(call).write();

  currentCalls[q.id] = call.id;

  const from = q.name? `${ q.name } ${ _phoneToStr(call.from) }` :_phoneToStr(call.from);
  message = `${ _html.b('Входящий') } звонок от ${ _html.a( from, decodeURI( q.link ) ) }`;

  res.status(200).json(currentCalls);
  bot.sendMessage(chatId, message, options );

});

app.listen(3000);

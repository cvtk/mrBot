const cfg = require('./config.json');
const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = lowDb( new FileSync(cfg['db-file']) );

module.exports = db;
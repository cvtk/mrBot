'use strict'
const re = {
  sp: '(\\s*)',
  create: '(нов|соз|доб|еще|new|cre|add|mor|\\+|yjd|cjp|lj,|tot|туц|ску|фвв|ьщк)\\S*',
  contact: '(кон|con|rjy|сщт\\S*)'
};

function regexp(fields) {
  
  const regex = fields.reduce( (r, field) => {
    if ( re[field] !== 'undefined' ) { return r += re[field] }
    else return r;
  }, '');
  // console.log('(\/|\.)' + regex + '\\s*$');
  return new RegExp( '(\\/|\\.)' + regex + '\\s*$', 'i');
};

module.exports = regexp;
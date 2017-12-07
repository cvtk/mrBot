'use strict'

const getCommandHandler = function(cmd) {
  const handlerPath = `./handlers/${ cmd }.js`;
  const handler = require(handlerPath);
  // try {
  //   if ( require.resolve(handlerPath) ) {
  //     const handler = require(handlerPath);
  //   }
  // } catch(e) {
  //     console.error('Handler is not found');
  //     process.exit(e.code);
  // }

  return handler;
};

const getCommandName = function(arg) {
  if ( typeof arg === 'undefined' ) return false;
  const shorthand = arg.slice(0, 3);
  const commandsList = {
    contacts: ['кон', 'con', 'rjy', 'сщт']
  };
  for ( let command in commandsList ) {
    if ( commandsList.hasOwnProperty(command) &&
        commandsList[command].some( cmd => cmd === shorthand.toLowerCase() ) ) {
      return command;
    }
  }
  return false;
};

const isChatCommand = function(message) {
  if ( typeof message === 'undefined' ) return false;
  const firstChar = message.charAt(0);
  return firstChar === '/' || firstChar === '.';
};

module.exports = function handlersRouter(msg) {
  if ( isChatCommand(msg.text) ) {
    const args = msg.text.slice(1).split(' ').filter( arg => arg.trim() ),
          cmd = getCommandName(args[0]);
    if ( cmd ) return getCommandHandler(cmd)(msg, args);
  }
}
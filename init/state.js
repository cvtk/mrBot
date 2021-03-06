'use strict'

class State {
  constructor() { this.sessions = {} };

  getCurrent(userId) {
    return typeof(this.sessions[userId]) !== 'undefined' && this.sessions[userId];
  }

  setCurrent(userId, state) {
    this.sessions[userId] = state;
  }
};

const state = new State();

module.exports = state;
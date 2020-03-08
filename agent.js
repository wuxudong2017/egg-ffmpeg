'use strict';

const bull = require('./bull');

module.exports = agent => {
  if (agent.config.bull.agent) {
    bull(agent);
  }
};

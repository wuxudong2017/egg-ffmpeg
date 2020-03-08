/*
 * @Description: 
 * @Version: 1.0
 * @Autor: 吴旭东
 * @Date: 2020-03-07 16:20:06
 */

'use strict';
const assert = require('assert');
const path = require('path');
const Bull = require('bull');
const fs = require('fs');
module.exports = app => {
  app.addSingleton('bull', createBull);
};

function createBull(config, app) {
  const { topic, queueOptions } = config;
  const { redis } = queueOptions;
  assert(topic, '[egg-bull] topic is required on config');
  assert(
    redis && redis.host && redis.port,
    '[egg-bull] host and port of redis are required on config'
  );
  app.coreLogger.info(
    `[egg-bull] connecting to ${redis.host} : ${redis.port}`
  );
  const queue = new Bull(topic, queueOptions);
  queue.on('error', error => {
    app.coreLogger.error(`[egg-bull] Error ! ${error.message}`);
  });
  app.beforeStart(() => {
    loadBullToApp(app, queue, topic);
  });
  return queue;
}

function loadBullToApp(app, queue, topic) {
  const dir = path.join(app.config.baseDir, 'app/bulls');
  fs.readdir(dir, function (error, file) {
    if (error) fs.mkdirSync(dir);
  })
  fs.stat(dir, (error, stats) => {
    if (error) app.coreLogger.error(`[egg-bull] ${error.message} `);
    if (stats.isDirectory()) {
      app.loader.loadToApp(dir, 'bulls', {
        caseStyle: 'lower',
        ignore: 'lib/**',
      });
      queue
        .on('completed', app.bulls[topic].status.completed)
        .on('failed', app.bulls[topic].status.failed)
        .on('waiting', app.bulls[topic].status.waiting)
        .on('active', app.bulls[topic].status.active)
        .on('stalled', app.bulls[topic].status.stalled)
        .on('progress', app.bulls[topic].status.progress)
        .on('paused', app.bulls[topic].status.paused)
        .on('resumed', app.bulls[topic].status.resumed)
        .on('cleaned', app.bulls[topic].status.cleaned)
        .on('drained', app.bulls[topic].status.drained)
        .on('removed', app.bulls[topic].status.removed)
        .process('*', app.bulls[topic].handle);
    } else {
      app.coreLogger.error(`[egg-bull] directory ${dir} is not exist `);
    }
  });
}

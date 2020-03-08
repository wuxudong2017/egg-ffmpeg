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
  const dir = path.join(app.config.baseDir, 'app/bull');
  fs.readdir(dir,function(error,file){
    if(error)  fs.mkdirSync(dir);
    const fileDir = path.join(dir,topic+'.js');
    fs.readFile(fileDir,(err,state)=>{
      if(err) fs.writeFileSync(fileDir,`module.exports = {
        status:{
            completed:async ()=>{
    
            },
            failed:async ()=>{
            
            },
            waiting:async ()=>{
            
            },
            active:async ()=>{
            
            },
            stalled:async ()=>{
            
            },
            progress:async ()=>{
            
            },
            paused:async ()=>{
            
            },
            resumed:async ()=>{
            
            },
            cleaned:async ()=>{
            
            },
            drained:async ()=>{
            
            },
            removed:async ()=>{
            
            },
        },
    
        handle:async()=>{
    
        },
    }`,{encoding:'utf-8'});
    })
  })
  fs.stat(dir, (error, stats) => {
    if (error) app.coreLogger.error(`[egg-bull] ${error.message} `);
    if (stats.isDirectory()) {
      app.loader.loadToApp(dir, topic, {
        caseStyle: 'lower',
        ignore: 'lib/**',
      });
      // queue
      //   .on('completed', app['bull'].status.completed)
      //   .on('failed', app['bull'].status.failed)
      //   .on('waiting', app['bull'].status.waiting)
      //   .on('active', app['bull'].status.active)
      //   .on('stalled', app['bull'].status.stalled)
      //   .on('progress', app['bull'].status.progress)
      //   .on('paused', app['bull'].status.paused)
      //   .on('resumed', app['bull'].status.resumed)
      //   .on('cleaned', app['bull'].status.cleaned)
      //   .on('drained', app['bull'].status.drained)
      //   .on('removed', app['bull'].status.removed)
      //   .process('*', app['bull'].handle);
    } else {
      app.coreLogger.error(`[egg-bull] directory ${dir} is not exist `);
    }
  });
}

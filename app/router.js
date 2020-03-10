'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/123',controller.home.player)
  // 文件上传
  router.get('/upload',controller.home.uploadGet)
  router.post('/upload',controller.home.uploadPost)
  // 队列操作
  router.get('/jobList',controller.bull.index.jobList)
  // 删除队列任务
  router.delete('/jobEmpty',controller.bull.index.jobEmpty)
  // 删除队列某个任务
  router.delete('/jobRemove/:jobId',controller.bull.index.jobRemove)
   // 重试队列某个任务
   router.put('/jobRetry/:jobId',controller.bull.index.jobRetry)
  // 获取任务信息
  router.get('/jobInfo/:jobId',controller.bull.index.jobInfo)
  // 暂停某个任务
  router.put('/jobPause/:jobId',controller.bull.index.jobPause)
};

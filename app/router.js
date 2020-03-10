'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/index',controller.home.player)
  // 文件上传
  router.get('/upload',controller.utils.upload.uploadGet)
  router.post('/upload',controller.utils.upload.uploadPost)
  // 队列操作
  router.get('/jobList',controller.utils.bull.jobList)
  // 删除队列任务
  router.delete('/jobEmpty',controller.utils.bull.jobEmpty)
  // 删除队列某个任务
  router.delete('/jobRemove/:jobId',controller.utils.bull.jobRemove)
   // 重试队列某个任务
   router.put('/jobRetry/:jobId',controller.utils.bull.jobRetry)
  // 获取任务信息
  router.get('/jobInfo/:jobId',controller.utils.bull.jobInfo)
  // 暂停某个任务
  router.put('/jobPause/:jobId',controller.utils.bull.jobPause)
};

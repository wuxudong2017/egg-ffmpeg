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
};

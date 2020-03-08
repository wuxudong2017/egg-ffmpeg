'use strict';
const path = require('path')
module.exports = appInfo => {
  const config = {};

  /**
   * @member Config#
   * @property {String} KEY - description
   */
  config.bull = {
    // Single queue
    //
    // client: {
    //   topic: 'queue',
    //   queueOptions: {
    //     redis: {
    //       host: 'localhost',
    //       port: 6379,
    //       db: 0,
    //       password: 'Pass1234',
    //     },
    //   },
    // },
    //
    // Multiple queue (recommended)
    //
    // clients: {
    //   queue1: {
    //     topic: 'queue1',
    //     queueOptions: {
    //       redis: {
    //         host: 'localhost',
    //         port: 6379,
    //         db: 1,
    //         password: 'Pass1234',
    //       },
    //     },
    //   },
    //   queue2: {
    //     topic: 'queue2',
    //     queueOptions: {
    //       redis: {
    //         host: 'localhost',
    //         port: 6379,
    //         db: 2,
    //         password: 'Pass1234',
    //       },
    //     },
    //   },
    // },
    //
    // or Use the same redis configuration
    //
    clients: {
      queue1: { topic: 'video' },
    },
    default: {
      queueOptions: {
        redis: {
          host: 'localhost',
          port: 6379,
          db: 6,
          password: '',
        },
      },
    },
    app:true,
    agent:false
  }
  config.view = {
    root:[path.join(appInfo.baseDir,'app/view')].join(','),
    mapping:{
      '.html':'nunjucks'
    }
  }


  return config;
};

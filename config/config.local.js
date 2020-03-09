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
    app: true,
    agent: false
  }
  config.view = {
    root: [path.join(appInfo.baseDir, 'app/view')].join(','),
    mapping: {
      '.html': 'nunjucks'
    }
  }
  // config.mongoose = {
  //   client: {
  //     url: 'mongodb://127.0.0.1:27017/egg_ffmepg',
  //     options: {},
  //   },
  // };
  config.security = {
    csrf: {
      enable: false
    }
  }
  config.multipart = {
    fileSize: '500mb',
    mode: 'stream',
    whitelist: [
      // text
      '.ppt', '.pptx', '.pps', '.doc', '.docx', '.txt', '.xlsx', '.xls', '.csv', '.pdf',
      // audio
      '.mp3', '.wav', '.aac', '.m4a', '.wma', '.midi',
      //video
      '.cd', '.mp4', '.asf', '.avi', '.dat', '.f4v', '.flv', '.mkv', '.mov', '.mpeg', '.mpg', '.rm', '.rmvb', '.wmv', '.mts', '.3gp', '.ram',
      // image
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.swf', '.fla',
      // zip
      '.zip', '.rar', '.7z']
  }

  return config;
};

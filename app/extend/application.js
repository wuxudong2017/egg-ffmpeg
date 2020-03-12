/*
 * @Description: 
 * @Version: 1.0
 * @Autor: 吴旭东
 * @Date: 2020-03-07 16:26:51
 */
'use strict';
const { transcode } = require('./ffmpegA');
const Bull = require('bull');
let opts_ffmpeg = {
  timeout: 1200 * 1000,
  delay: 3 * 1000,
  attempts: 5,
  backoff: { type: 'exponential', delay: 60000 }
}
const path = require('path')
const setting = {
  antiurl: ['dsasdfasddfs'],
  host: 'http://localhost:7001/',
  hd: '480', // 清晰度
  antiredirect: 'https://ffmpeg.moejj.com/kk',
  encryptionKey: '123456', // ts 加密秘钥
  SEC: 'on', // 秒切
  screenshots: 2, // 切图数量
  watermarkPath: path.join(__dirname, '../', '/public/mark/mark.png'), // 水印的地址
  api: 'on',
  tsjiami: 'on'
}

module.exports = {
  /**
   * @description: 任务添加队列方法
   * @param {array} jobs 队列数组 
   * @return: 
   */
  async addJobToQueue(jobs) {
    const { logger } = this;
    return new Promise((resolve, reject) => {
      // console.log(this.bull)
      Promise.all(
        jobs.map(item => {
          return new Promise((resolve, reject) => {
            let { queue, name, data, opts } = item;
            opts = Object.assign(opts_ffmpeg, opts)
            let _queue = this.getQueue(queue)

            _queue
              .add(name, data, opts)
              .then(job => {
                resolve(job);
              })
              .catch(error => {
                reject(error);
              });
          });
        })
      )
        .then(job => {
          logger.info('[egg-bull] Jobs add success');
          resolve(job);
        })
        .catch(error => {
          logger.error(
            `[egg-bull] Jobs add failed ! Because of ${error}`
          );
          reject(error);
        });
    });
  },
  getQueue(queue) {
    let _queue;
    if (this.bull instanceof Bull) {
      _queue = this.bull;
    } else if (this.bull.get(queue) instanceof Bull) {
      _queue = this.bull.get(queue);
    } else {
      throw new Error('get Queue instance failed !');
    }
    return _queue
  },
  /**
   * @description: 转码服务 
   * @param {type} 
   * @return: 
   */
  async ffmpeg(params) {
    try {
      const setting = await this.model.Setting.find();
      const result = await transcode(params, setting[0]);
      let status;
      if (result.code == 200) {
        status = 'completed'
      } else {
        status = 'failed'
      }
      await this.model.File.update({ _id: params._id }, { status })
    } catch (error) {
      throw Error(error)
    }
  }
};

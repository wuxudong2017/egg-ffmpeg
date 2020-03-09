/*
 * @Description: 
 * @Version: 1.0
 * @Autor: 吴旭东
 * @Date: 2020-03-07 16:26:51
 */
'use strict';
const {transcode} = require('./ffmpeg');
const Bull = require('bull');
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
            const { queue, name, data, opts } = item;
            let _queue;
            if (this.bull instanceof Bull) {
              _queue = this.bull;
            } else if (this.bull.get(queue) instanceof Bull) {
              _queue = this.bull.get(queue);
            } else {
              reject('get Queue instance failed !');
            }
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
/**
 * @description: 转码服务 
 * @param {type} 
 * @return: 
 */  
   ffmpegFun(params){
    return new  Promise((resolve,reject)=>{
      try{
        transcode(params);
        resolve()
      }catch(err){
        reject(err)
      }
    })
  }
};

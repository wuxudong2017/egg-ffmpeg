/*
 * @Description: 
 * @Version: 1.0
 * @Autor: 吴旭东
 * @Date: 2020-03-07 16:26:51
 */
'use strict';
const Bull = require('bull');
module.exports = {
  async addJobToQueue(jobs) {
    
    const { logger } = this;
    return new Promise((resolve, reject) => {
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
            `[egg-bull] Jobs add failed ! Because of ${error.message}`
          );
          reject(error);
        });
    });
  },
};

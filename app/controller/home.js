'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx ,app} = this;
    const jobs = [{
      topic:'test',
      queue: 'queue',
      data: {
        name:'吴旭东'
      },
      jobName: 'kkk',
      options: {
        // job options
      }
    }];
    await app.addJobToQueue(jobs);
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;

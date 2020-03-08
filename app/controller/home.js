'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    const jobs = [{
      topic: 'video',
      queue: 'queue1',
      data: {
        name: '吴旭东'
      },
      name: 'kkk',
      opts: {
        /**
    attempts: 1,
    delay: 0,
    timestamp: 1583665449908,
    backoff: undefined
         */
      }
    }];
    // await app.addJobToQueue(jobs);
    await this.app.ffmpegFun()
    ctx.body = 'hi, egg';
  }
  async player() {
    const { ctx } = this;
    await ctx.render('index.html')
  }
}

module.exports = HomeController;

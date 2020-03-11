'use strict';
const fs = require('fs');
const path = require('path');
const awaitStreamReady = require('await-stream-ready').write;
const uuid = require('uuid/v1');
const md5 = require('md5')
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
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
    // await this.app.ffmpegFun({ filePath: 'G:/0Egg/my/egg-ffmpeg/app/public/video/a.mkv', _id: '123' })
    let result = await this.app.getQueue('queue1');
    console.log(result)
    ctx.body = 'hi, egg';
  }
  async player() {
    const { ctx } = this;
    await ctx.render('index.html')
  }
}

module.exports = HomeController;

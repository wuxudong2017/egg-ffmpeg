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
    // await this.app.ffmpegFun({ filePath: 'G:/0Egg/my/egg-ffmpeg/app/public/video/a.mkv', _id: '123' })
    // let result = await this.app.getQueue('queue1');
    // console.log(app)
    let result = await app.ffmpeg({
      "filePath": "G:\\0Egg\\my\\egg-ffmpeg\\app\\public\\uploads\\other\\9278d3e0635a11eabf2bc785f4abcd96.mkv",
      "_id": "5e6879640e8a4a0b90e3382b",
      "folderName": "other",
      "type": 12
    });
    ctx.body =result;
  }
  async player() {
    const { ctx } = this;
    await ctx.render('index.html')
  }
}

module.exports = HomeController;

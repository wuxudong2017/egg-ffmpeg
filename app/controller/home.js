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
    ctx.body = 'hi, egg';
  }
  async player() {
    const { ctx } = this;
    await ctx.render('index.html')
  }
  // 文件上传
  async uploadGet() {
    const { ctx,app } = this;
    await ctx.render('upload.html')
  }
  async uploadPost() {
    const { ctx,app } = this;
    // 获取 steam
    const stream = await ctx.getFileStream();
    const fields = stream.fields;
    const folderName = fields.folderName||'other';
    const originalname = stream.filename;
    const name =md5(uuid()) 
    const filename = name+path.extname(originalname);
    // 上传基础目录
    const uplaodBasePath = 'app/public/uploads/';
    // 生成文件夹
    const dirName = folderName;
    const saveDir = path.join(this.config.baseDir, uplaodBasePath, dirName)
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);
    // 生成写入路径 
    const target = path.join(this.config.baseDir, uplaodBasePath, dirName, filename);
    // 写入流
    const writeStream = fs.createWriteStream(target);
    try {
      // 写入文件
      await awaitStreamReady(stream.pipe(writeStream));
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
    // 文件上传完成加入转码队列
    await app.addJobToQueue([{
      topic: 'video',
      queue: 'queue1',
      data: {
        filePath:target,
        _id:name
      },
      name: '转码队列',
    }])


    // 文件上传完成后操作
    ctx.body = 'success';
  }
}

module.exports = HomeController;

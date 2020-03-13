'use strict';
const fs = require('fs');
const path = require('path');
const awaitStreamReady = require('await-stream-ready').write;
const uuid = require('uuid/v1');
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
const Controller = require('egg').Controller;

class UploadController extends Controller {
  // 文件上传
  async uploadGet() {
    const { ctx, app } = this;
    await ctx.render('upload.html')
  }
  async uploadPost() {
    const { ctx, app } = this;
    // 获取 steam
    const stream = await ctx.getFileStream();
    const fields = stream.fields;
    const folderName = fields.folderName || 'other';
    const originalName = stream.filename;
    const suffix = path.extname(originalName).replace('.', '');
    const contentType = stream.mimeType;
    const name = uuid().replace(/\-/g, '');
    const size = stream.length > 1024 ? parseFloat(stream.length / 1024, 2) + 'Mb' : stream.length
    const fileName = name+'.'+suffix

    // 上传基础目录
    const uplaodBasePath = '/public/uploads';
    // 生成文件夹
    const saveDir = path.join(this.config.baseDir, 'app/' + uplaodBasePath, folderName);
    console.log(saveDir)
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir);
    // 生成写入路径 
    const target = path.join(saveDir, fileName);
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
    //  文件存储数据库
    const result = await app.model.File.create({
      originalName,
      fileName,
      folderName,
      filePath: target,
      suffix,
      convertFile: null,
      thumbnail: null,
      contentType,
      size,
      url: uplaodBasePath + '/' + folderName + '/' + fileName,
      status: null
    });
    ctx.state.playerId = result._id
    // 文件上传完成加入转码队列
    await app.addJobToQueue([{
      topic: 'video',
      queue: 'queue1',
      data: {
        filePath: target,
        _id: result._id,
        folderName,
        type:12,
        originalName,
        suffix
      },
      name: '视频转码队列',
    }])
    ctx.body = result;
  }
}

module.exports = UploadController;

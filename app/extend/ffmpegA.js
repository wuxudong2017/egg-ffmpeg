/**
 * 转码核心方法
 */
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const nsg = require('node-sprite-generator');
const Jimp = require('jimp');
const path = require('path')
/**
 * @description: 转码方法
 * @param {object} movie  {filePath:存放地址,_id:唯一标识}
 * @return  {function}
 */
exports.transcode = function (movie,setting) {
    const filePath = movie.filePath;
    const id = movie._id;
    const des = path.join(__dirname, '../public/video', id);
    const videoarr = filePath.split(".");
    videoarr.pop();
    const srtpath = videoarr.join(".") + ".srt";
    fs.exists(des, function (exists) {
        if (!exists) {
            fs.mkdir(des, function (err) {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, function (err, metadata) {
            if (err) {
                reject(err);
            }
            let wmimage = setting.watermarkPath;
            let hd = setting.hd * 1;
            let wd = 0;
            let markdir = path.join(__dirname, '../', '/public/mark/mark.png');
            let videometa = metadata.format;
            let videostreams = metadata.streams;
            let bitrate = Math.floor(videometa.bit_rate / 1000);
            let size = "";
            let bv = 500;
            let bufsize = 1000;
            let maxrate = 500;
            let config = [];
            let videooriginH = 0;
            let videooriginC = "";
            let audiooriginC = "";
            let tsjiami = setting.tsjiami;
            if (!wmimage || wmimage == "") {
                wmimage = markdir;
            }
            let vf = 'movie=' + wmimage + ' [watermark]; [in][watermark] overlay=10:10:1 [out]';
            if (hd == 480) {
                wd = 720;
            } else if (hd == 1080) {
                wd = 1920;
                bv = 2000;
                bufsize = 4000;
                maxrate = 2000;
            } else {
                wd = 1280;
                bv = 1000;
                bufsize = 2000;
                maxrate = 1000;
            }
            if (bitrate < bv) {
                bv = bitrate;
                maxrate = bv;
                bufsize = 2 * bv;
            }
            for (let i = 0; i < videostreams.length; i++) {
                if (videostreams[i].codec_type == 'video') {
                    if (videostreams[i].height <= hd) {
                        hd = videostreams[i].height;
                    }
                    if (videostreams[i].width <= wd) {
                        wd = videostreams[i].width;
                    }
                    videooriginH = videostreams[i].height;
                    videooriginC = videostreams[i].codec_name;
                    break;
                }
            }
            for (let i = 0; i < videostreams.length; i++) {
                if (videostreams[i].codec_type == 'audio') {
                    audiooriginC = videostreams[i].codec_name;
                    break;
                }
            }
            size = wd + "x" + hd;
            let srtexists = fs.existsSync(srtpath);
            if (srtexists) {
                vf = 'movie=' + wmimage + ' [watermark]; [in][watermark] overlay=10:10:1,subtitles=' + srtpath + '[out]';
            }
            config = [
                '-s ' + size,
                '-b:v ' + bv + "k",
                '-vcodec libx264',
                '-acodec aac',
                '-ac 2',
                '-b:a 128k',
                '-bufsize ' + bufsize + "k",
                '-maxrate ' + maxrate + "k",
                '-q:v 6',
                '-strict -2',
                '-start_number 0',
                '-hls_time 20',
                '-hls_list_size 0',
                '-f hls'
            ];
            if (tsjiami == 'on') {
                fs.writeFileSync(des + "/key.info", setting.host + "public/video/" + id + "/ts.key\n" + des + "/ts.key");
                let key = randomkey();
                fs.writeFileSync(des + "/ts.key", key);
                let jiamiconfig = '-hls_key_info_file ' + des + '/key.info';
                config.push(jiamiconfig);
            }
            if (setting.miaoqie == "on") {
                if (videooriginH <= setting.hd * 1 && videooriginC == "h264" && audiooriginC == "aac") {
                    if (srtexists) {
                        ffmpegtransandchunk(des, filePath, config, vf, id).then(res => {
                            resolve(res)
                        });
                    } else {
                        chunk(filePath, des, id, config, vf, tsjiami);
                    }
                } else {
                    ffmpegtransandchunk(des, filePath, config, vf, id).then(res => {
                        resolve(res)
                    });
                }
            } else {
                ffmpegtransandchunk(des, filePath, config, vf, id).then(res => {
                    resolve(res)
                });
            }
        })
    })
}
/**
 * @description: 转码并切片
 * @param {string} des 输出地址 
 * @param {string} filePath 视频地址 
 * @param {object} config 配置 
 * @param {string} vf 码率 
 * @return: 
 */
function ffmpegtransandchunk(des, filePath, config, vf) {
    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .addOptions(config)
            // .addOption('-vf', vf)
            .output(des + '/index.m3u8')
            .on('start', function (cmd) {
                console.log(cmd)
                console.log('转码并切片开始')
            })
            .on('error', function (err, stdout, stderr) {
                console.log('Cannot process video: ' + filePath + err.message);
                reject('Cannot process video: ' + filePath + err.message)
            })
            .on('end', function () {
                screenshots(filePath, des);
                resolve({ code: 1, message: '转码并切片完成' })
                console.log('转码并切片完成')
            })
            .run()
    })
}
/**
 * @description: 截图方法
 * @param {string} filePath  视频地址
 * @param {string} des  存放地址
 * @return: 
 */
function screenshots(filePath, des) {
    ffmpeg(filePath)
        .screenshots({
            count: 2,
            filename: "%i.jpg",
            folder: des
        })
        .on('end', function () {
            // thumbnails(des, filePath);
        });

}
/**
  * @description: 切片方法
  * @param {string} filePath  视频地址
  * @param {string} des  存放地址
  * @param {object} config  配置
  * @param {string} vf  码率
  * @return: 
  */
function chunk(filePath, des, config, vf, tsjiami) {
    return new Promise((resolve, reject) => {
        let chunkconfig = [
            '-c copy',
            '-bsf:v h264_mp4toannexb',
            '-hls_time 20',
            '-strict -2',
            '-start_number 0',
            '-hls_list_size 0'
        ];
        if (tsjiami == 'on') {
            chunkconfig.push('-hls_key_info_file ' + des + '/key.info');
        }
        ffmpeg(filePath)
            .addOptions(chunkconfig)
            // .addOption('-vf',vf)
            .output(des + "/index.m3u8")

            .on('error', function (err, stdout, stderr) {
                reject(err)
                deleteall(des);
                fs.mkdirSync(des);
                ffmpegtransandchunk(des, filePath, config, vf, id);
            })
            .on("start", function () {
                console.log('切片完成')
                //    切片完成
            }).on('end', function () {
                screenshots(filePath, des);
                resolve()
            })
            .run()
    })
}
/**
 * @description: 删除所有
 * @param {string} filePath 文件夹地址 
 * @return: 
 */
function deleteall(filePath) {
    let files = [];
    if (fs.existsSync(filePath)) {
        files = fs.readdirSync(filePath);
        files.forEach(function (file, index) {
            let curPath = filePath + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(filePath);
    }
};
/**
 * @description: 缩略图
 * @param {string} des 生成地址 
 * @param {string} filePath 视频文件地址 
 */
function thumbnails(des, filePath) {
    let tmp = des + '/dplayer-thumbnails';
    let output = des + '/thumbnails.jpg';
    ffmpeg(filePath)
        .screenshots({
            count: 100,
            folder: tmp,
            filename: 'screenshot%00i.png',
            size: '160x?'
        })
        .on('end', function () {
            nsg({
                src: [
                    tmp + '/*.png'
                ],
                spritePath: tmp + '/sprite.png',
                stylesheetPath: tmp + '/sprite.css',
                layout: 'horizontal',
                compositor: 'jimp'
            }, function (err) {
                Jimp.read(tmp + '/sprite.png', function (err, lenna) {
                    if (err) throw err;
                    lenna.quality(parseInt(85))
                        .write(output);
                    fs.unlinkSync(filePath);
                    deleteall(tmp);
                });
            });
        });
}
/**
 * @description 只进行转码服务,不切片
 * @param {type} 
 * @return: 
 */
function ffmpegtrans(path, des, size, bv, bufsize, maxrate, vf, id, cb) {
    return new Promise((resolve, reject) => {
        ffmpeg(path)
            .addOptions([
                '-s ' + size,
                '-b:v ' + bv,
                '-vcodec libx264',
                '-acodec aac',
                '-ac 2',
                '-b:a 128k',
                '-bufsize ' + bufsize,
                '-maxrate ' + maxrate,
                '-q:v 6',
                '-strict -2'
            ])
            // .addOption('-vf', vf)
            .output(des + '/index.mp4')
            .on('start', cb)
            .on('error', function (err, stdout, stderr) {
                console.log('Cannot process video: ' + path + err.message);
                reject(err)
            })
            .on('end', function () {
                resolve();
            })
            .run()
    })
}

// 生成随机数
function randomkey() {
    let data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "A", "B", "C", "D", "E", "F", "G"];
    for (let j = 0; j < 500; j++) {
        let result = "";
        for (let i = 0; i < 16; i++) {
            r = Math.floor(Math.random() * data.length);
            result += data[r];
        }
        return result;
    }
}
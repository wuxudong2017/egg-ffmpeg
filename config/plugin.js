'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  nunjucks:{
    enable:true,
    package:'egg-view-nunjucks'
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  cors:{
    enable:true,
    package:'egg-cors'
  }
};

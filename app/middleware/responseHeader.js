/*
 * @Description: Controller 和 Service 抛出异常处理
 * @Version: 1.0
 * @Autor: 吴旭东
 * @Date: 2020-01-16 11:33:33
 */
'use strict'
module.exports = () => {
  return async function responseHeader(ctx, next) {
    try {
      ctx.set('Content-Type', 'application/json; charset=UTF-8') // 设置response 数据格式为json,根据情况使用
      if(ctx.status==404&&!ctx.body){
        ctx.body={
          status:404,
          message:'Not Found',
          data:null
        }
      }
      await next()
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const message = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = { status, message, data: null };
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
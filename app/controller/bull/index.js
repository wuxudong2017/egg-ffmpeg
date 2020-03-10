'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    // 获取job list
    async jobList() {
        const { ctx, app } = this;
        const { query } = ctx.request;
        const limit = query.limit || 10,
            offset = query.offset || 1,
            queue = query.queue || 'queue1',
            asc = query.asc || true,
            types = query.types || 'completed';
        const typesArr = types.split(',');
        const row = await app.getQueue(queue).getJobs(typesArr, (offset - 1) * limit, offset * limit - 1, asc)
        const count = await app.getQueue(queue).getJobCounts()
        ctx.success({ row, count })
    }
    // 清空所有队列任务
    async jobEmpty() {
        const { ctx, app } = this;
        const { queue } = ctx.request.query;
        const data = await app.getQueue(queue).empty();
        ctx.success(data, '', 'empty Data Successfull')
    }
    //删除某任务
    async jobRemove() {
        const { ctx, app } = this;
        const { queue } = ctx.request.query;
        const { jobId } = ctx.params;
        const job = await app.getQueue(queue).getJob(jobId);
        if (!job) {
            ctx.fail(404, '该任务未找到')
        } else {
            const data = await job.remove();
            ctx.success(data)
        }

    }
    //重试某任务
    async jobRetry() {
        const { ctx, app } = this;
        const { queue } = ctx.request.query;
        const { jobId } = ctx.params;
        const job = await app.getQueue(queue).getJob(jobId);
        if (!job) {
            ctx.fail(404, '该任务未找到')
        } else {
            const state = await job.getState();
            if (state != 'completed' && state != 'failed') {
                const data = await job.retry();
                ctx.success(data)
            } else {
                ctx.fail(403, '该任务非失败态，无法重试');
            }

        }
    }
    // 查看某个任务
    async jobRetry() {
        const { ctx, app } = this;
        const { queue } = ctx.request.query;
        const { jobId } = ctx.params;
        let job = await app.getQueue(queue).getJob(jobId);
        if (!job) {
            ctx.fail(404, '该任务未找到')
        } else {
            const state = await job.getState();
            const data = Object.assign(JSON.parse(JSON.stringify(job)), { state })
            ctx.success(data);
        }
    }
    // 暂停某个任务
    async jobPause() {
        const { ctx, app } = this;
        const { queue } = ctx.request.query;
        const { jobId } = ctx.params;
        let job = await app.getQueue(queue).getJob(jobId);
        if (!job) {
            ctx.fail(404, '该任务未找到')
        } else {
            const state = await job.getState();
            if (state == 'active') {
                const data = await app.getQueue(queue).pause();
                ctx.success(data)
            } else {
                ctx.fail(500, '当前任务不在')
            }
        }
    }
}

module.exports = IndexController;

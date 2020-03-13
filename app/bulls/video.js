const fs = require('fs')
module.exports = app => {
    return {
        handle: async (job, done) => {
            // 任务处理函数
            console.log('/**********开始处理***************/')
            try {
                const state = fs.existsSync(job.data.filePath);
                if(!state){
                    const err = 'fail: connot find file' + job.data.filePath;
                    return done(new Error(err))
                }
                //   开始转码
                await app.ffmpeg(job.data)
                return done( );
            } catch (err) {
                return done(new Error(err))
            }
        },
        status: {
            active: async (jobPromise) => {
                // A job has started. You can use `jobPromise.cancel()`` to abort it.
                console.log('/**************active****************/')
                console.log(jobPromise)
                console.log('/******************************/')
            },
            stalled: async (job) => {
                // A job has been marked as stalled. This is useful for debugging job
                // workers that crash or pause the event loop.
                console.log('/**************stalled****************/')
                console.log(job)

                console.log('/******************************/')
            },
            progress: async (job, progress) => {
                console.log('/**************progress****************/')
                console.log(job)
                console.log(progress)
                console.log('/******************************/')

            },
            completed: async (result) => {
                // A job successfully completed with a `result`.
                console.log('/**************complete****************/')
                console.log(result)
                console.log('/******************************/')
            },
            waiting: async (jobId) => {
                // 当前等待的jobId
                console.log('/**************waiting****************/')
                console.log(jobId)
                console.log('/******************************/')

            },
            failed: async (job, err) => {
                // A job failed with reason `err`!
                console.log('/**************failed****************/')
                console.log(job)
                console.log(err)
                console.log('/******************************/')

            },
            paused: async () => {
                // The queue has been paused.停止所有任务

            },
            resumed: async (job) => {
                // The queue has been resumed.
                // A job failed with reason `err`!
                console.log('/**************resumed****************/')
                console.log(job)
                console.log('/******************************/')
            },
            cleaned: async (jobs, type) => {
                // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
                // jobs, and `type` is the type of jobs cleaned.
                console.log('/**************cleaned****************/')
                console.log(jobs)
                console.log(type)
                console.log('/******************************/')
            },
            removed: async (job) => {
                // A job successfully removed.
                console.log('/**************removed****************/')
                console.log(job)
                console.log('/******************************/')
            },
            drained: async () => {

            },
        },
    }
}
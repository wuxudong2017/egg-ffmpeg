module.exports = {
    handle: async (job, done) => {
        // 任务处理函数
        try {
            console.log(job)
            return done();
        } catch (err) {
            return done(new Error(err))
        }
    },
    status: {
        waiting: async (jobId) => {
            // 当前等待的jobId
        },
        active: async (job, jobPromise) => {
            // A job has started. You can use `jobPromise.cancel()`` to abort it.
        },
        stalled: async (job) => {
            // A job has been marked as stalled. This is useful for debugging job
            // workers that crash or pause the event loop.
        },
        progress: async (job, progress) => {

        },
        completed: async (job, result) => {
            // A job successfully completed with a `result`.
        },

        failed: async (job, err) => {
            // A job failed with reason `err`!
        },
        paused: async () => {
            // The queue has been paused.停止所有任务
        },
        resumed: async (job) => {
            // The queue has been resumed.
        },
        cleaned: async (jobs, type) => {
            // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
            // jobs, and `type` is the type of jobs cleaned.
        },
        removed: async (job) => {
            // A job successfully removed.
        },
        drained: async () => {

        },
    },
}
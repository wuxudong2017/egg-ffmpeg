module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const FileSchema = new Schema({
    });
    FileSchema.pre('save', function (next) {
        if (!this.createAt) {
            this.createAt = Date.now();
        }
        next();
    });
    return mongoose.model('File', FileSchema);
}
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
   
    const SettingSchema = new Schema({
        host: String,
        hd: String,
        antiurl: [String],
        antiredirect: String,
        encryptionKey: String,
        watermarkPath: String,
        SEC: String,
        screenshots: Number,
        tsjiami: String,
        api: String,
        createAt: {
            type: Date,
            default: Date.now()
        }
    });
    SettingSchema.pre('save', function (next) {
        if (!this.createAt) {
            this.createAt = Date.now();
        }
        next();
    });
   
    return mongoose.model('Setting', SettingSchema);
  }
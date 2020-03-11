module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
   
    const FileSchema = new Schema({
        url:String,
        size:String,
        contentType:String,
        originalName:String,
        suffix:String,
        fileName:String,
        folderName:String,
        filePath:String,
        convertFile:String,
        thumbnail:String,
        createAt: {
            type: Date,
            default: Date.now()
        },
        status:String
    });
    FileSchema.pre('save', function (next) {
        if (!this.createAt) {
            this.createAt = Date.now();
        }
        next();
    });
   
    return mongoose.model('File', FileSchema);
  }

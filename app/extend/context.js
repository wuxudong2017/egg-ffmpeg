'use strict'
module.exports = {
    fail(status,message){
        this.body = {status,message,data:null};
        this.status = status
    },
    success(data,status,message){
        this.status = status||200;
        this.body = {
            status:status||200,
            data,
            message:message||'Successfull get data'
        }
    },
    notFound(message){
        message = message|| 'Not Found';
        this.throw(404,message)
    },
    
}
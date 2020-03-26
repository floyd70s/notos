'use strict'
var mongoose= require('mongoose')
var Schema= mongoose.Schema

var UserSchema= Schema({
    name:String,
    rut:String,
    email:String,
    role:String,
    phone:Number,
    account_type:String,
    bank:String,
    bank_account:Number,
    password:String,
    status:String,
    date:Date 
})

module.exports= mongoose.model('User',UserSchema)

'use strict'
var mongoose= require('mongoose')
var Schema= mongoose.Schema

var UserSchema= Schema({
    name:String,
    rut:String,
    email:String,
    password:String,
    role:String,
    phone:Number,
    bank_account:Number,
    bank:String,
    date:Date
})

module.exports= mongoose.model('User',UserSchema)

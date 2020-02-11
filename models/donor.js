'use strict'
var mongoose= require('mongoose')
var Schema= mongoose.Schema

var DonorSchema= Schema({
    email:String,
    phone:Number,
    date:Date
})

module.exports= mongoose.model('donor',DonorSchema)

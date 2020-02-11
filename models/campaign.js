'use strict'
var mongoose= require('mongoose')
var Schema= mongoose.Schema

var CampaignSchema= Schema({
    name:String,
    description:String,
    image:String,
    date:Date,
    hashtag:String,
    validity:Date
})

module.exports= mongoose.model('campaign',CampaignSchema)

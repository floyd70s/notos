'use strict'

/**
 * @author CPerezD
 * @description aca se definen las rutas para el modelo campaña
 */

var express= require('express')
var CampaignController=require('../controllers/campaign')
var api= express.Router();
var md_auth= require('../middlewares/authenticated')

var multipart=require('connect-multiparty')
var md_upload=multipart({uploadDir:'./uploads/users'})

api.post('/saveCampaign',CampaignController.saveCampaign)
api.post('/upload-Image-campaign/:id',[md_auth.ensureAuth,md_upload],CampaignController.uploadImage)
api.get('/get-Image-campaign/:imageFile',CampaignController.getImageFile)
module.exports=api
 
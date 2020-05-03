'use strict'
var fs = require('fs')
var path = require('path')
var Campaign = require('../models/campaign')
var User = require('../models/user')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../services/jwt')
var nodemailer = require('nodemailer');
const ejs = require('ejs');



function uploadImage(req, res) {
    var artistId = req.params.id
    var file_name = 'no subido.'

    if (req.files) {
        var file_path = req.files.image.path
        var file_split = file_path.split('/')
        var file_name = file_split[2]
        var ext_file = file_name.split('.')
        var file_ext = ext_file[1]

        console.log('campaignId: ' + artistId)
        console.log('file_name: ' + file_name)

        if (file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'png') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (!artistUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar la imagen' })
                } else {
                    res.status(200).send({ artist: artistUpdated })
                }
            })
        } else {
            res.status(200).send({ message: 'La extension no es correcta' })
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' })
    }
}
function getImageFile(req, res) {
    var imageFile = req.params.imageFile
    var path_file = './uploads/campaign/' + imageFile
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    })
}

function saveCampaign(req, res) {
    console.log('inicio de registro de CAMPAIGN - saveCampaign')
    var campaign = new Campaign()
    var params = req.body
    let now = new Date();
    
    campaign.name = params.name
    campaign.description = params.description
    campaign.image = 'null'
    campaign.date= now
    campaign.hashtag='test'
    campaign.validity= now.getDate() + 60
    campaign.rut=params.rut
    
    console.log('-- aca')

    campaign.save((err, campaignStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar la campaña' })
            console.log(err.message)
        } else {
            if (!campaignStored) {
                res.status(404).send({ message: 'La campaña no ha sido guardado' })
            } else {
                res.status(200).send({ campaign: campaignStored })
            }
        }

    })

}

function getCampaignByRut(req, res) {
    var params = req.body
    var rut = params.rut
    var email = params.email
    var password = params.password

    console.log('-------getUserByRut------------')
    console.log('Body:' + JSON.stringify(params))
    console.log('rut:' + rut)

    User.findOne({ rut: rut }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' })
        } else {
            if (!user) {
                res.status(205).send({ message: 'El rut no Existe' })
            } else {
                console.log('devuelve usuario')
                res.status(200).send({ user })
            }
        }
    })
}

function getCampaigns(req, res) {
    Campaign.find({}, (err, campaign) => {
        if (err) {
            res.status(500).send({ message: err })
        } else {
            if (!User) {
                res.status(400).send({ message: 'el usuario no existe' })
            } else {
                res.status(200).send( campaign)
            }
        }
    })
}



module.exports = {
    uploadImage,
    getImageFile,
    saveCampaign,
    getCampaignByRut,
    saveCampaign,
    getCampaigns
}

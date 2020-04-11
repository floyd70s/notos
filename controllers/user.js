'use strict'
var fs = require('fs')
var path = require('path')
var User = require('../models/user')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../services/jwt')
//Requerimos el paquete
var nodemailer = require('nodemailer');


function pruebas(req, res) {
    res.status(200).send({
        message: 'prueba de controlador'
    })
}

/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res
 * @description: funcion de registro de usuarios 
 */
function saveUser(req, res) {
    console.clear()
    console.log('inicio de registro de usuario - saveUser')
    console.log(JSON.stringify(req.body))
    var user = new User()
    var params = req.body
    let now = new Date();

    user.name = params.name
    user.rut = params.rut
    user.email = params.email
    user.role = 'user'//params.role
    user.phone = params.phone
    user.account_type = params.account_type
    user.bank = params.bank
    user.bank_account = params.bank_account
    user.date = now
    user.status = 'pre-active'

    const newPassword = Math.floor(100000 + Math.random() * 900000)
    console.log('new pass:'+newPassword)
    if (newPassword) {
        //encriptar contraseña
        bcrypt.hash(newPassword, null, null, function (err, hash) {
            user.password = hash;

            console.log('------ saveUser ------')
            console.log(user.name)
            console.log(user.rut)
            console.log(user.email)
            console.log(user.role)
            console.log(user.phone)
            console.log(user.bank_account)
            console.log(user.bank)
            console.log(user.password)
            console.log(user.date)
            console.log(user.status)

            if (user.name != null &&
                user.rut != null &&
                user.email != null &&
                user.password != null &&
                user.phone != null &&
                user.bank_account != null &&
                user.bank != null
            ) {
                //guardar usuario
                user.save((err, userStored) => {
                    if (err) {
                        console.log('error 500: ' + err.message)
                        res.status(500).send({ message: err.message })
                    } else {
                        if (!userStored) {
                            console.log('error 404: No se ha registrado el usuario')
                            res.status(404).send({ message: 'No se ha registrado el usuario' })
                        } else {
                            console.log('200 usuario registrado.')
                            sendEmail(user,newPassword)
                            res.status(200).send({ user: userStored })
                        }
                    }
                })
            }
            else {
                res.status(500).send({ message: 'complete los campos' })
            }
        })
    }
}

/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res 
 * @description funcion de ingreso de usuarios.
 */
function loginUser(req, res) {
    var params = req.body
    var email = params.email
    var password = params.password

    console.log('email:' + email)
    console.log('password:' + password)

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' })
        } else {
            if (!user) {
                res.status(404).send({ message: 'El usuario no Existe' })
            } else {
                //comprobar contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //devolver datos usuario si viene el hash
                        if (params.gethash) {
                            //devolver token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        } else {
                            res.status(200).send({ user })
                        }
                    } else {
                        res.status(404).send({ message: 'El usuario no Existe.' })
                    }
                })
            }

        }
    })
}

/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res 
 * @description funcion de actualizacion de datos de usuarios.
 */
function updateUser(req, res) {
    var userId = req.params.id
    var update = req.body

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar usuario' })
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' })
            } else {
                res.status(200).send({ user: userUpdated })
            }
        }
    })
}
/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res
 * @description funcion que permite subir una imagen al usuario 
 */
function uploadImage(req, res) {
    var userId = req.params.id
    var file_name = 'No subido...'

    if (req.files) {
        var file_path = req.files.image.path
        var file_split = file_path.split('/')
        var file_name = file_split[2]
        var ext_file = file_name.split('.')
        var file_ext = ext_file[1]

        if (file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'png') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario' })
                } else {
                    res.status(200).send({ user: userUpdated })
                }
            })
        } else {
            res.status(200).send({ message: 'La extension no es correcta' })
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' })
    }
}
/**
 * @author Cperez
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {
    var imageFile = req.params.imageFile
    var path_file = './uploads/users/' + imageFile
    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file))
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    })
}


function getUsers(req, res) {
    var rut = req.params.rut
    console.log('busqueda de usuario por rut: ' + rut)

    User.find({}, (err, user) => {
        if (err) {
            res.status(500).send({ message: err })
        } else {
            if (!User) {
                res.status(400).send({ message: 'el usuario no existe' })
            } else {
                res.status(200).send({ user })
            }
        }
    })
}
/**
 * @author CPerez
 * @param {*} req 
 * @param {*} res 
 * @description funcion de ingreso de usuarios.
 */
function getUserByRut(req, res) {
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

function sendEmail(user,newPassword) {
    console.log('--------inicio de envio de correo - sendEmail: ')
    console.log(user.email)
    //Creamos el objeto de transporte
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contacto.notos@gmail.com',
            pass: 'Galloviejo1'
        }
    });

    var mensaje = "Muchas gracias " + user.name +" por registrarte en notos, tu codigo de seguridad para activar tu cuenta es:"+newPassword;

    var mailOptions = {
        from: 'contacto.notos@gmail.com',
        to: user.email,
        subject: 'Registro nuevo usuario',
        text: mensaje
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}



module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
    getUserByRut,
    getUsers
}

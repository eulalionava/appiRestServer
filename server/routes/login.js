const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();

//request login con autenticacion
app.post('/login',(req,res)=>{

    let body = req.body;
    //busca solo un usuario
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err:'fallos en el email'
            })
        }
        //Hay usuario
        if(! usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'USuario o contraseña incorrectos'
                }
            })
        }

        //compara si son iguales las contraseñas
        if( !bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'USuario o contraseña incorrectos'
                }
            })
        }
        //Se genere el token
        //process.env.SEED  se encuentran en config/cofig.js
        //process.env.CADUCIDAD_TOKEN 
        let token =  jwt.sign({
            usuario:usuarioDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN })

        //regresa un json
        res.json({
            ok:true,
            Usuario:usuarioDB,
            token
        })


    })
})

module.exports = app;
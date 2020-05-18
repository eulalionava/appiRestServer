const express = require('express');
 const { verificaTokenImagen }  = require('../middlaweres/autenticacion');
const fs = require('fs');
const path = require('path');

const app= express();

app.get('imagen/:tipo/:img',verificaTokenImagen,(req,res)=>{
    let tipo  = req.params.tipo;
    let imagen = req.params.img;

    let pathImg = `../../uploads/${tipo}/${imagen}`;

    //Existe el directorio
    
    if( fs.existsSync( pathImg  )){
        res.sendFile( pathImg)
    }else{
        let imageNoPath = path.resolve( __dirname ,'../assets/no-image.jpeg');
        res.sendFile( imageNoPath );

    }

})

module.exports = app;
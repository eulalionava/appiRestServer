const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


const app = express();


// opciones default
app.use( fileUpload() );

app.put('/upload/:tipo/:id',(req,res)=>{

    //obtenemos los parametros
    let tipo = req.params.tipo;
    let id = req.params.id;

    if( ! req.files ){
       return  res.json({
            ok:false,
            message:'No se ha seleccionado ningun archivo'
        })
    }

    //validaciones de tipos
    let tiposValidos = ['producto','usuario'];
    if( tiposValidos.indexOf(tipo) < 0){
        return res.json({
            ok:false,
            err:{
                message:'Las tipos validos son: ' + tiposValidos.join(', ')
            }
        })
    }
    let subirArchiv = req.files.archivo;
    //Obtenemos la extension
    let nombreCortado = subirArchiv.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    let extesionesValidas = ['png','jpg','gif','jpeg'];

    if( extesionesValidas.indexOf(extension) < 0){
        return res.json({
            ok:false,
            err:{
                message:'Las extensiones validas son: ' + extesionesValidas.join(', ')
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${tipo}-${new Date().getMilliseconds()}.${extension}`;

    //Subir archivo
    subirArchiv.mv(`uploads/${tipo}/${subirArchiv.name}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        //Funcion
        if( tipo === 'usuarios'){
            imagenUsuario(id,res,nombreArchivo);

        }else{
            imagenProducto(id,res,nombreArchivo);
        }

        
    })


});

function imagenUsuario(id,res,nombreArchivo){

    Usuario.findById( id, (err,usuarioDB )=>{

        if(err){
            borrarArchivo(nombreArchivo.img,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( ! usuarioDB ){
            borrarArchivo(nombreArchivo,'usuarios');
            return res.json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img,tipo);

        usuarioDB.img = nombreArchivo;
        //guarda el nombre del archivo en la base de datos 
        usuarioDB.save( (err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario:usuarioGuardado,
                imag:nombreArchivo
            })
        })

    })
}

function imagenProducto( id , res,nombreArchivo){

    
    Producto.findById( id, (err,productoDB )=>{

        if(err){
            borrarArchivo(nombreArchivo.img,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( ! productoDB ){
            borrarArchivo(nombreArchivo,'productos');
            return res.json({
                ok:false,
                err:{
                    message:'Usuario no existe'
                }
            })
        }

        borrarArchivo(productoDB.img,tipo);

        productoDB.img = nombreArchivo;
        //guarda el nombre del archivo en la base de datos 
        productoDB.save( (err,productoGuardado)=>{
            res.json({
                ok:true,
                usuario:productoGuardado,
                imag:nombreArchivo
            })
        })

    })

}


function borrarArchivo (nombreArchivo,tipo){

    //creamos el path
    let pathImagen = path.resolve( __dirname ,`../../uploads/${tipo}/${nombreArchivo}`);

    //existe archivo
    if( fs.existsSync( pathImagen )){
        //Borra archivo
        fs.unlinkSync( pathImagen);
    }

}

module.exports = app;
const express = require('express');
const { verificaToken ,verificaAdmin_role} = require('../middlaweres/autenticacion');
const Categoria = require('../models/categoria');
const app = express();

//MOSTRAR LA LISTA DE CATEGORIAS
app.get('/categoria',verificaToken,(req,res)=>{
    Categoria.find({})
                .sort('descripcion')
                .populate('usuario','nombre email')
                .exec( (err,categorias)=>{

                    if(err){
                        return res.status(500).json({
                            ok:false,
                            err
                        })
                    }

                    res.json({
                        ok:true,
                        categorias
                    })
                })
})

//MOSTRAR CATEGORIA POR ID
app.get('/categoria/:id',verificaToken,(req,res)=>{
    
    let id = req.params.id;

    Categoria.findById( id,(err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(! categoriaDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'El id no es valido'
                }
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })

    })
})

app.post('/categoria',verificaToken,(req,res)=>{
    // obtenemos datos
    let body = req.body

    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    })

    categoria.save( (err,categoriaDB)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( ! categoriaDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Imposible crear una categoria'
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })



    })
})
app.put('/categoria/:id',verificaToken,(req,res)=>{
    
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion:body.descripcion
    }

    Categoria.findByIdAndUpdate(id,descCategoria,{new:true,runValidators:true},(err,categoriaDB)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'erro al crer la categoria'
                }
            })
        }

        if( ! categoriaDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Imposible crear una categoria'
                }
            })
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        })
    })
})

//SOLO UN ADMINISTRADOR PUEDE BORRAR LAS CATEGORIAS
app.delete('/categoria/:id',[verificaToken,verificaAdmin_role],(req,res)=>{
    
    let id = req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'Error en la ejecucion'
                }
            })
        }

        if( ! categoriaDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Imposible borrar la categoria'
                }
            })
        }

        res.json({
            ok:true,
            message:'Categoria borrada'
        })
    })
    
})


module.exports = app;
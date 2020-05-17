const express = require('express');
const { verificaToken ,verificaAdmin_role} = require('../middlaweres/autenticacion');
const Producto = require('../models/producto');
const app = express();

//MOSTRAR LA LISTA DE CATEGORIAS
app.get('/productos',verificaToken,(req,res)=>{
    let desde= req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
                .skip(desde)
                .limit(5)
                .populate('usuario','nombre email')
                .populate('categoria','descripcion')
                .exec( (err,productos)=>{

                    if(err){
                        return res.status(500).json({
                            ok:false,
                            err
                        })
                    }

                    if( ! productos){
                        return res.status(500).json({
                            ok:false,
                            message:'No hay productos'
                        })
                    }

                    res.json({
                        ok:true,
                        productos
                    })
                })
})

//MOSTRAR CATEGORIA POR ID
app.get('/productos/:id',verificaToken,(req,res)=>{
    
    let id = req.params.id;

    Producto.findById( id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(! productoDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'El id no es valido'
                }
            })
        }
        res.json({
            ok:true,
            Producto:productoDB
        })

    })
})

app.post('/producto',verificaToken,(req,res)=>{
    // obtenemos datos
    let body = req.body

    let producto = new Producto({
        usuario:req.usuario._id,
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria
    })

    producto.save( (err,productoDB)=>{


        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( ! productoDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Imposible crear una categoria'
                }
            })
        }

        res.json({
            ok:true,
            producto:productoDB
        })



    })
})
app.put('/producto/:id',verificaToken,(req,res)=>{
    
    let id = req.params.id;
    let body = req.body;

    let descproductos = {
        descripcion:body.descripcion
    }

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( ! productoDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El producto no existe'
                }
            })
        }

        //Obtenemos los cambios
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        //guarda cambios
        productoDB.save( (err,productoGuadado)=>{

            return res.status(500).json({
                ok:false,
                message:'El producto no pudo ser guardado'
            })

            res.json({
                ok:true,
                producto:productoGuadado
            })

        })
    })

    
})

//Servicion que solo cambia la disponibiidad
app.delete('/producto/:id',[verificaToken,verificaAdmin_role],(req,res)=>{
    
    let id = req.params.id;
    Producto.findById(id,(err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( ! productoDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Imposible borrar la categoria'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save( (err,productoBorrado)=>{

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                message:'producto borrado'
            })
        })
    })
    
})

//Busqueda lijera similar un like de mysql
app.get('/productos/buscar/:termine',verificaToken,(req,res)=>{

    let temino = req.params.termino;
    let busca = new RegExp(temino,'i');

    Producto.find({nombre:termino})
    .populate('categoria','nombre')
    .exec( (err,productos)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            productos
        })
    })

})


module.exports = app;
require('./config/config');

const express = require('express');
const app = express();
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario',function(req,res){
    res.send('hola mundo')
})

app.post('/usuario',function(req,res){
    let body =req.body;
    res.send({
        body
    })
})

app.put('/usuario/;id',function(req,res){
    let id= req.params.id;
    res.send('hola mundo')
})

app.delete('/usario',function(req,res){
    res.send('hola mundo')
})

app.listen(process.env.PORT,()=>{
    console.log("escuchando el puerto ");
})
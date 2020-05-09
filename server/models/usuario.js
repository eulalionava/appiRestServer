 const mongoose = require('mongoose');
 
 const uniqueValidator = require('mongoose-unique-validator');

 let rolesValidos = {
     values:['ADMIN_ROLE','USER_ROLE'],
     message:'{VALUE} no es un rol valido'
 }

 let Schema = mongoose.Schema;

 let usuarioSchema = new Schema({

    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'El email es obligatorio']
    },
    password:{
        type:String,
        required:[true,'La constresela es abligatoria']
    },
    img:{
        type:String
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
 })

 //borramos un campo que no querramos mostrar
 usuarioSchema.methods.toJSON = function(){
     let user = this;
     let userObject = user.toObject();
     delete userObject.password
     return userObject;
 }

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico '})

 module.exports = mongoose.model('Usuario',usuarioSchema)
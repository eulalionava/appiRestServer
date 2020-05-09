const jwt = require('jsonwebtoken');

let verificaToken = (req,res,next)=>{

    let token =  req.get('token');

    //vericamos pasando el token,la secret
    jwt.verify(token,process.env.SEED,(err,decoded)=>{

        //existe un error
        if( err ){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'token no valido'
                }
            })
        }

        //obtiene datos del usuario
        req.usuario = decoded.usuario;
        next();// esta para ejecutar la uncion de login
    })


}

//verificar admin_role
let verificaAdmin_role = (req,res,next)=>{
    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })
    }

}

module.exports = {
    verificaToken,
    verificaAdmin_role
}
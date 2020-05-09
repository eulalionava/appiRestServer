
//PUERTO
process.env.PORT = process.env.PORT || 3000;

//vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED de authenticacion
process.env.SEED = process.env.SEED || 'secret';
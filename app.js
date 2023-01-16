const express = require('express');
const mongoose = require ('mongoose');
const Route_sauces = require('./routes/sauces');
const Route_Users = require ('./routes/user');
const path = require ('path');
//**Mise en place des variables d'environnements pour la sécurité**//
require('dotenv').config({ path: './ENV.env' });


const app = express();
//Avoir un accés au corps de la requête//
 app.use(express.json());      
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });  
  
    //Connexion avec mongoAtlas//mongodb+srv://
   //**Le compte de l'administrateur MongooDB est caché**//
     mongoose.connect(process.env.DATABASE_MONGODB,
   { useNewUrlParser: true,
     useUnifiedTopology: true })
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

   //Début d'adresse de l'API  //
   app.use('/images',express.static(path.join(__dirname,'images')));
   app.use('/api/sauces',Route_sauces);
   app.use('/api/auth',Route_Users);

module.exports = app;



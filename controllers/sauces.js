// in controllers/sauces.js

const express = require('express');
const SauceObject = require('../models/SauceObject');
const fs = require ('fs'); 
const User = require('../models/User');
const { userInfo } = require('os');
var reload = require('express-reload')


//Mettre à jours une sauce existante//
exports.updateSauce =(req, res, next)=>{
  //Est ce qu(il y a un fichier de type File?//
  if(req.file){
    //Si oui alors retrouve moi le produit selectionné//
    SauceObject.findOne({_id:req.params.id})    
    .then((objet)=>{
    //avec le callback on récupère le nom de l'image//  
     const UpdateImage = objet.imageUrl.split(`/images`)[1];     
     //Grâce à fs.unlik on supprime l'image du server//  
      fs.unlink(`images${UpdateImage}`,(error)=>{
        if (error) throw error;
      })
    })
    .catch(error => res.status(400).json({ error }));
    //On extrait le nom de fichier à supprimer//  
  
  }
    console.log("Contenu req.file =>",req.file);
  const thingObject = req.file ?  
  {
     ...JSON.parse(req.body.sauce),       
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    //
    //  
  } : { ...req.body };  
  
  SauceObject.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
  console.log(thingObject);
};

//Rechercher une sauce//
exports.oneSauce = (req, res, next) =>{
  console.log(req.params.id)
  SauceObject.findOne({_id:req.params.id})
  .then(SauceObject => res.status(200).json(SauceObject))
  .catch(error => res.status(404).json({error}))
}

//Supprimer une sauce//
exports.deleteSauce=(req, res, next) =>{
  //Trouver l'objet dans la base de donnés//
  SauceObject.findOne({_id:req.params.id})
  //Quand on le trouve//
    .then(thing =>{
      //On extrait le nom de fichier à supprimer//
     const filename =thing.imageUrl.split(`/images/`)[1];
     //supprime l'image du server avec fs.unlink//
     fs.unlink(`images/${filename}`,()=>{
      SauceObject.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
     })
    })  
    .catch(error => res.status(500).json({error}));
}

//créer une sauce //
exports.postSauces = (req, res, next) => {
  const sauceJson = (JSON.parse(req.body.sauce));
  console.log("test");
  delete sauceJson._id;
  const thing = new SauceObject({
    likes:req.body.likes = 0, 
    dislikes:req.body.dislikes = 0,
    usersLiked :req.body.usersLiked = [],
    usersDisliked:req.body.usersDisliked = [],
    ...sauceJson,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(thing);
  
  thing.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//Avoir le tableau des sauces []//
exports.getSauces = (req, res, next) => {
  SauceObject.find()
  .then(SauceObject => res.status(200).json(SauceObject))
  .catch(error => res.status(400).json({error}));
};

//******************************************//
// le système de like //
exports.postLikeDislike = (req, res, next) => 
{  
            console.log("Vote en temps réél like: ",req.body.like);
            console.log('vote en temps réél dislike :',req.body.dislike);
            console.log("Id du produit selectionné : ", {_id : req.params.id});
            console.log("Id de l'utilisateur qui est connecté : ",req.body.userId);
          //********************ANALYSE DES DONNEES****************************************************///////// */
          //like//    
          SauceObject.findOne({_id: req.params.id })//Recherche de l'objet séléctionné par l'utilisateur//      
          .then((objet)=>{
          if(!objet.usersLiked.includes(req.body.userId) && req.body.like === 1){
            console.log("executé");            
                  //Mise à jours de la base de donnée//
          SauceObject.updateOne(
            {_id : req.params.id},
            {
              $inc:{likes:1},  
              $push:{usersLiked :req.body.userId}
            }
          )      
          .then(() => res.status(200).json({message:"ok"}))
          .catch(error => res.status(404).json(error))   
          }
            
          if(objet.usersLiked.includes(req.body.userId) && req.body.like === 0){
            console.log("executé");            
                  //Mise à jours de la base de donnée like//
        SauceObject.updateOne(
          {_id : req.params.id},
          {
              $inc:{likes:-1},  
              $pull:{usersLiked :req.body.userId}
          }
          
        )      
        .then(() => res.status(200).json({message:"ok"}))
        .catch(error => res.status(404).json(error))
        }

        //Dislike ok fonctionne //
        if(!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1)        
        {
          
          console.log(req.body.likes);
          console.log("executé -1"); 
          SauceObject.updateOne(
            
            {_id:req.params.id},
            {
                
                $inc:{dislikes: 1},
                $push:{usersDisliked:req.body.userId}
            }           
         )
         .then(() => res.status(200).json({message:"ok"}))
         .catch(error => res.status(404).json(error))
        } 
         //Annuler le dislike//
         if(objet.usersDisliked.includes(req.body.userId) && req.body.like === 0)
         {
            console.log("annule dislike = 0");
            SauceObject.updateOne(
              {_id:req.params.id},
              {

                $inc:{dislikes: -1 },
                $pull:{usersDisliked:req.body.userId}
              }            
            )      
            .then(() => res.status(200).json({message:"ok"}))
            .catch(error => res.status(404).json(error))   
         }      
          }  
     
    )     
 }//==> End exports.postLikeDislike //



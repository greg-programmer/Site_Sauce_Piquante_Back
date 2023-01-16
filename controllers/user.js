
//************************RECUPERATION ET IMPORTATION DES FICHIERS****************************************//

//Installation de bcrypt via le package node//
const bcrypt = require('bcrypt');
//Importation du fichier comprenant le token pour les users, ensuite il est stocké dans une variable//
const jwt = require('jsonwebtoken');
//Importation du fichier comprenant le model de l'objet user afin de pouvoir utiliser toutes les fonctions//
const user = require ('../models/User');
//**Mise en place des variables d'environnements pour la sécurité**//
require('dotenv').config({ path: './ENV.env' })
//****RegexMotDePasse*******//

//************************MIDDLEWARE SIGNUP**************************************************************//

//Création de la fonction signup ,de plus, elle sera exporté via exports dans le fichier "route/User" //
exports.signup =(req,res,next)=>{
  //Le mot de passe doit comporter au moin 2 Majuscules, 1 minuscules, 2 chiffres et avoir une longueur de 10 au minimum//
  const regexPass = /^(?=.{10,}$)(?=(?:.*?[A-Z]){2})(?=.*?[a-z])(?=(?:.*?[0-9]){2}).*$/.test(req.body.password);
  console.log(regexPass);
  //Controle de l'adresse email//
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email);
  console.log(regexEmail);
 //***Robustesse du mot de passe et controle de l'adresse email**// 
  if(regexPass && regexEmail){  
     //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois//
     bcrypt.hash(req.body.password,10)
     //Récupération du hash du mot de passe qui sera enregistrer ensuite dans un nouveau user dans la base donnés//
     .then(hash => {
      //Création d'un constante userSinup, Cette constant comprend un nouvel objet avec un email et le mot de passe hasher et salé donc plus sécurisé// 
     const userSignup = new user({      
             email : req.body.email,
             password :hash
     });
     userSignup.save()
         .then(()=> res.status(201).json({message :'utilisateur créé !'}))
         .catch(error => res.status(400).json({error}));
     })
     .catch(error => res.status(500).json({error}));
  } 
  else{
    res.status(401).json({Message:'utilisateur non créé ! '});
  }
   //***L'utilisateur ne peut pas s'enregistrer**//
};

//************************MIDDLEWARE LOGIN**************************************************************//

//Création de la fonction login ,de plus, elle sera exporté via exports dans le fichier "route/User" //
exports.login = (req, res, next) => {
//Trouver le user dans la base de donnés qui correspond à l'adresse email qui est rentré par l'utilisateur...
// et si jamais l'utilisateur n'existe pas on renvoie un erreur//  
 //finOne pour trouver un seul utilisateur dans la base de donnés et comme l'adresse est unique alors ...
 //on trouvera obligatoirement la bonne adresse//
               //{Objet de comparaison, objet filtre}// 
               //Adresse mail == Adresse mail envoyé dans la requête//
  user.findOne({ email: req.body.email })
  //.then(user => = Est-ce qu'on a récupéré un user ou non?)// 
    .then(user => {
     //Si il n'y pas de user alors on revoie un 401//     
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
     //Si il y a un user trouvé alors on utilisera bcrypte pour comparer...
     //le mot de passe envoyé par l'utilisateur qui essaye de se connecter avec le hash...
     //qui est enregistrer avec le user qu'on a reçu ligne46// 
     //On fait apel à la fonction compare pour comparer//
      //bcrypt.compare(mot de passe envoyé avec la requête,avec le hash qui est enregistré dans la base de donnés//           
      bcrypt.compare(req.body.password, user.password)
        //Dans le .then on reçois un boolean pour savoir si la comparaison est valable ou non//      
        .then(valid => {
           //If différent de valid (false) donc mot de passe incorrect//
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          //Sinon si true, on renvoie un status 200 ok + 
          //un objet json qui contient({
           //UserId : user._id = Identifiant de l'utilisateur //
           //token : jwt.sign = //
           //La connexion sera envoyé et donc validé//
          //)}//      
          //
          res.status(200).json({
            userId: user._id,
  //Importation de jsonwebtoken //
            //token :jwt.sign(
              //{id utilisateur du user comme ça on est sur que cette requête //
              //correspond à ce user Id l69, mais aussi pour éviter que d'autres utilisateurs puissent faire des modifications}//
              //{clé secrète pour l'encodage}//
            //{Expiration du token au bout de 24h}//
            token: jwt.sign(
              { userId: user._id },
              //**Token caché**/
              process.env.DATABASE_TOKEN,
              //**Durée du token caché**//
              { expiresIn: process.env.DATE_NOW}
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })//erreur serveur (500)//
    .catch(error => res.status(500).json({ error }));    
};




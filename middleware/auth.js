//Importation du fichier jsonwebtoken pour pouvoir vérifier les token//
const jwt = require('jsonwebtoken');
//**Mise en place des variables d'environnements pour la sécurité**//
require('dotenv').config({ path: './ENV.env' })
module.exports = (req, res, next) => {
  //Utilisation de try et catch pour pouvoir gérer chaques lignes en cas de problème//
  try {
    //on créé une constante et dans le header de la requête on récupère authorization //
   //.split('')[1] va retourner un array avec bearer en premier élément et le token en second ,donc on récupére le token du tableau //
    const token = req.headers.authorization.split(' ')[1];
    //nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée //
    const decodedToken = jwt.verify(token, process.env.DATABASE_TOKEN);
    //Une fois l'objet décodé, il se transforme en objet javascript classique, donc, on peut récupèrer le userId dedans//
    const userId = decodedToken.userId;
    //Si on a un userId dans le corps de la requête et que celui est différent du userId on renvoie un erreur //
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
     //sinon on peut passer aux prochains middlewares// 
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
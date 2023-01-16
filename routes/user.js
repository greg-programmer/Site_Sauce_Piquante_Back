
//Importation express//
const express = require('express');
//Création d'un routeur//
const router = express.Router();
const userCtrl = require('../controllers/user');

//*****Route pour l'authentification************//

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;


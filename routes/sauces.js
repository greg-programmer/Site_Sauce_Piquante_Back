
const express = require('express');
const router = express.Router();
const auth = require ('../middleware/auth')
const multer = require ('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauces');

router.get('/:id',auth,stuffCtrl.oneSauce);
router.post('/',auth,multer,stuffCtrl.postSauces);
router.put('/:id',auth,multer,stuffCtrl.updateSauce);
router.get('/',auth, stuffCtrl.getSauces);
router.post('/:id/like',auth,stuffCtrl.postLikeDislike);

router.delete('/:id',auth,stuffCtrl.deleteSauce);

module.exports = router;

//Object pour la sauce//

const mongoose = require ('mongoose');
const thingSchemaCreate = mongoose.Schema({
    userId : {type:String, required:true},
    name:{type:String,required :true},
    manufacturer :{type:String, required: true},
    description :{type:String, required:true},
    mainPepper :{type:String, required:true},
    imageUrl :{type:String, required:true},
    heat :{type:Number, required:true},
    likes :{type:Number },
    dislikes :{type :Number},
    usersLiked:[String,Number],
    usersDisliked:[String,Number],
})
//Pour pouvoir lire notre schéma//
module.exports=mongoose.model('SauceObjectCreate', thingSchemaCreate);
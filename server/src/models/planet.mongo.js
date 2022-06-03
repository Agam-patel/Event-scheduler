const mongoose=require('mongoose')
const planetschema=new mongoose.Schema({
    keplerName:{
        type:String,
        required:true
    }

});
module.exports=mongoose.model('Planet',planetschema)
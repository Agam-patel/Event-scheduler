
const moongose=require('mongoose');
const launcheSchema=new moongose.Schema({
  flightNumber:{type:Number,
                  required:true,
                },

  mission:{type:String,required:true},

  rocket:{type:String,required:true},

  launchDate:{type:Date,
    required:true},

  target:{
    type:String,
    
  },

  customers:[String],

  upcoming:{type:Boolean,required:true},

  success:{type:Boolean,required:true,default:true}
});
// connect lauchesschema to launches collection
module.exports=moongose.model('Launch',launcheSchema);
const mongoose=require('mongoose')
require('dotenv').config();
const mongourl=process.env.MONGO_URL

mongoose.connection.once('open',()=>{
    console.log('MonGoDB connection Ready!')
})
mongoose.connection.on('error',(err)=>{
console.error(err);
})
async function mongoconnect(){
    await mongoose.connect(mongourl);
}
module.exports={
    mongoconnect,
}
const {parse}=require('csv-parse');
const fs=require('fs');
const path=require('path');
const planets=require('./planet.mongo')
// stream Large Dataset
// is a functino return EvenEmitter
// parse();

// break things down smallest things changes
// const results=[];
function isHabitablePlanet(planet){
    return planet['koi_disposition']==='CONFIRMED' && planet['koi_insol']>0.36&&planet['koi_insol']<1.11 &&planet['koi_prad']<1.6;
}

// const promise=new Promise();Promise.then
function loadplanetdata(){
    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname,'..','data','kepler_data.csv')).pipe(parse({
            comment:'#',
            columns:true,
        
        })).on('data',async(data)=>{
            if(isHabitablePlanet(data)){
                // insert +update=upsert== insert data into collection if it is doesn't exist.
                savaplanet(data);
            
            }
        }).on('error',(err)=>{
            console.log(err);
            reject(err);
        }).on('end',async()=>{
            const countplanet=(await getAllPlanets()).length
            console.log(`We found ${countplanet} number of Habitable Planet`);
            resolve();
        })
    })
   
}

async function getAllPlanets(){
    return await planets.find({},{
        '__v':0,
        '_id':0
    });
}
async function savaplanet(planet){
    try{
        await planets.updateOne({keplerName:planet.kepler_name},{
            keplerName:planet.kepler_name
    
          },{upsert:true});
        //   console.log('updated planet')
    }catch(err){
        console.err('we could not save planet ')
    }
    
}
module.exports={
    loadplanetdata,
    getAllPlanets,
}
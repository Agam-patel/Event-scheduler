const {getAllPlanets}=require('../../models/planets.model');
// IT is like planets modle
async function httpgetAllPlanets(req,res){
   return res.status(200).json(await getAllPlanets());
}
module.exports={
    httpgetAllPlanets,
}
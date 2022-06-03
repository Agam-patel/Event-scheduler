const {getAllLaunches,schedulenewlaunch,existsLaunchWithId, abortlaunchByid}=require('../../models/launchesmodel')
const {getPagination}=require('../../services/query')
async function httpgetAllLaunches(req,res){
    console.log(req.query);
    const {skip,limit}=getPagination(req.query);
    const launches=await getAllLaunches(skip,limit);
    return res.status(200).json(launches)
}
async function httpaddnewlaunch(req,res){
    const launch=req.body;
    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({
            error:"require missing some property Invalid Input"
        });
    }
    launch.launchDate=new Date(launch.launchDate);
// if(isNaN(launch.launchDate)){
//     return res.status(400).json({
//         error:'Invalid launch date',
//     })
// }
    await schedulenewlaunch(launch);
   return res.status(201).json(launch);
}
async function httpAbortLaunch(req,res){
    const launchId = +req.params.id;
    // if launch doesn;t exist
    const existslaunch=await existsLaunchWithId(launchId)
    if(!existslaunch){
        return res.status(400).json({
            error:"launch Not Found",
        })
    }
   
    const aborted=await abortlaunchByid(launchId);
    if(!aborted){
        return res.status(400).json({
            error:'Launch Not Aborted',
        })
    }
    return res.status(200).json({
        ok:true,
    });
    // return res.status(200).json(aborted);
}
module.exports={httpgetAllLaunches,
httpaddnewlaunch,httpAbortLaunch}
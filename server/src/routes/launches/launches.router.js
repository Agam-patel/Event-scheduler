const express=require('express');
const {httpgetAllLaunches,httpaddnewlaunch,httpAbortLaunch}=require('./launches.controller')
const launchesRouter=express.Router();
launchesRouter.get('/',httpgetAllLaunches);
launchesRouter.delete('/:id',httpAbortLaunch);
launchesRouter.post('/',httpaddnewlaunch); 
module.exports=launchesRouter;
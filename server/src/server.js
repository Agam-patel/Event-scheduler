// const express=require('express');
// const app=express();
// app.listen();
const http=require('http');
const {mongoconnect}=require('./services/mongo')
const {loadlaunchdata}=require('./models/launchesmodel')
const app=require('./app');
// const mongoose=require('mongoose');
const {loadplanetdata}=require('./models/planets.model')

const PORT=process.env.PORT||8000;

const server=http.createServer(app);
// IT is doing just organize our code better.

async function startServer(){
    await mongoconnect();
        // useNewUrlParser:true,
        // useFindAndModify:false,
        // useCreateIndex:true,
        // useUnifiedTopology:true,
    await loadplanetdata();
    await loadlaunchdata();
    server.listen(PORT,()=>{
        console.log(   `listening on ${PORT}`);
    })
}
startServer();
// for environment varible we called process.env.port||
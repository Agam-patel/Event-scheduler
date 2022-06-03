const express=require('express');
const path=require('path');
const cors=require('cors')
// const planetsRouter=require('./routes/planets/planets.router')
// const launchesRouter=require('./routes/launches/launches.router')
const morgan=require('morgan')
const api=require('./routes/api')
const app=express();
// express is just a middleware Understand.
app.use(cors(
    {
        origin:'http://localhost:3000'
    }
));
// log npm pakage.
app.use(morgan('combined'))
app.use(express.json());

app.use(express.static(path.join(__dirname,'..','public')));
app.use('/v1',api)

// app.use('/planets',planetsRouter);
// app.use('/launches',launchesRouter);

// If endpoints Doesn't mathch above then it passes throught below to match for react application for its routing which is client side routing.

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,"..",'public','index.html'))
})
module.exports=app;
const express=require('express');
const app=express();

app.use("/home",(req,res)=>{
    res.send('welcome to the project')
})

app.use("/text",(req,res)=>{
    res.send('welcome to the profile page')
})

app.listen(3000,()=>{
    console.log("server is running in port 3000");
})
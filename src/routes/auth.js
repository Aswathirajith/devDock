const express=require('express');
const authRouter=express.Router();
const validation=require('../utils/validation')
const User=require('../models/user')
const bcrypt=require('bcrypt')
const JWT=require('jsonwebtoken');
const {userAuth}=require('../auth');

authRouter.post('/signup',async(req,res)=>{

    try {

        //validation of data

        validation(req);

        //encript password
        const password=req.body.password;
        const paswwordHash=await bcrypt.hash(password,10);

  
         const user=new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            emailId:req.body.emailId,
            password:paswwordHash
         })


        await user.save({

        });

        res.send("user detailed saved")
    } catch (error) {
        res.status(400).send("Error: "+error.message)
    }

})





authRouter.post('/login',async(req,res)=>{
  try {
    
    const {emailId,password}=req.body;

    const user=await User.findOne({emailId:emailId});

    if(!user)
    {
        throw new Error("Invalid credential")
    }

    const passwordConform=await bcrypt.compare(password,user.password);
    if(passwordConform)
    {

        //jwt

        const token= await JWT.sign({_id:user._id},"DevDocker@123",{expiresIn:'1d'})
        //cookie

        res.cookie('token',token);
        res.send("login successfull")
    }else{
         throw new Error("Invalid credential");
    }
  } catch (error) {
    res.send('error: '+error.message)
  }
})


authRouter.post('/logout',(req,res)=>{

   // res.cookie('token',null,{expiresIn:new Date(Date.now())}); this will work same but not a safe way to clear cookie
    res.clearCookie('token');
    res.send("Logout successfull");

})

module.exports=authRouter;
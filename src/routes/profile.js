const express=require('express');
const profileRouter=express.Router();
const {userAuth}=require('../auth');
const {validateEdit}=require('../auth');
const { validate } = require('../models/user');
const bcrypt=require('bcrypt');
const validator=require('validator');


profileRouter.get('/profile/view',userAuth,async(req,res)=>{
    
   try {
    
    const user=req.user;
    res.send(user)

   } catch (error) {
    res.send("Error: "+error.message)
   }
   

})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try {
       
       if(!validateEdit(req))
        {
            throw new Error("cant validate these feild")
        } 

        const loggedUser=req.user;

        

        Object.keys(req.body).forEach((feild)=>loggedUser[feild]=req.body[feild]);

        await loggedUser.save();

        res.json({message:`${loggedUser.firstName} your profile edited succesfull`})
      

        

    } catch (error) {
        res.send("error: "+error.message)
    }

})


profileRouter.patch('/profile/password',userAuth,async(req,res)=>{

    try {

       
        const {oldPassword,newPassword}=req.body;

        const loggedUser=req.user;

        const passwordConform=await bcrypt.compare(oldPassword,loggedUser.password);

        if(!passwordConform)
        {
            throw new Error("old password is not correct");
        }

        if(!validator.isStrongPassword(newPassword))
        {
             throw new Error("your password is not strong enough")
        }

        loggedUser.password=await bcrypt.hash(newPassword, 10);

        await loggedUser.save();

        res.send("password changed");
        

  
        
    } catch (error) {
        res.send("error:"+error.message)
    }
})

profileRouter.patch('/profile/forgotPassword',userAuth,async(req,res)=>{
    try {
        
    const {newPassword,conformPassword}=req.body;

     if(newPassword!=conformPassword)
     {
      throw new Error("password not matching");
     }

      if(!validator.isStrongPassword(newPassword))
        {
             throw new Error("your password is not strong enough")
        }

     const loggedUser=req.user;

     loggedUser.password=await bcrypt.hash(newPassword, 10);

     loggedUser.save()

     res.send("password changed")


    } catch (error) {
        res.send("error: "+error.message)
    }

    

})

module.exports=profileRouter;
const express=require('express');
const userRouter=express.Router();
const User=require('../models/user')

userRouter.get('/user', async(req,res)=>{
    const userEmail=req.body.emailId;
  
    try {
        const user=await User.find({emailId:userEmail});
        if(user.length==0)
        {
            res.send("no user");
        }else{
            res.send(user);
        }
    } catch (error) {
        res.send("something wrong");
    }
})

userRouter.delete('/user',async(req,res)=>{
    const userId=req.body.userId

    try {
        const user=await User.findByIdAndDelete(userId)

        res.send("delete user")
        
    } catch (error) {
        res.send("something wrong")
    }
})


module.exports=userRouter
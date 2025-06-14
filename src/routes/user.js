const express=require('express');
const { userAuth } = require('../auth');
const userRouter=express.Router();
const User=require('../models/user')
const ConnectionRequest=require('../models/connectionRequest');

userRouter.get('/user/request',userAuth,async(req,res)=>{
    try {

        const loggedInUser=req.user;

        
      

        const connectionRequest=await ConnectionRequest.find({toUserId:loggedInUser._id,status:"intrested"}).populate('fromUserId',["firstName","lastName","gender","age","skills","about"]);

        const data=connectionRequest.map((row)=>row.fromUserId)
        res.json({message:"your request",data});

    } catch (error) {
       res.send("error"+error.message); 
    }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

        const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
       }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

        res.json({message:"your connections",data});

    } catch (error) {
        res.send("error "+error.message);
    }
})

userRouter.get('/feed',userAuth,async(req,res)=>{
  try {
    
      const loggedInUser=req.user;


      const page = parseInt(req.query.page) || 1;
       let limit = parseInt(req.query.limit) || 10;
       limit = limit > 50 ? 50 : limit;
       const skip = (page - 1) * limit;


    const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
    const connectionRequests=await ConnectionRequest.find({$or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]}).select("fromUserId toUserId");

     const hideUsersFromFeed = new Set();
     
      connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

      const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],}).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({message:"your request",users});
  } catch (error) {
    res.send("error "+error.message);
  }
})



module.exports=userRouter
const express=require('express');
const requestRouter=express.Router();
const {userAuth}=require('../auth');
const ConnectionRequest=require('../models/connectionRequest');
const User=require('../models/user')

requestRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{

    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=["intrested","ignored"];

        if(!allowedStatus.includes(status))
        {
            throw new Error("invalid status");
        }

        const toUser=await User.findById(toUserId);

        if(!toUser)
        {
             throw new Error("invalid user")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
          });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }


        const connectionRequest=new ConnectionRequest({
            fromUserId:fromUserId,
            toUserId:toUserId,
            status:status})

       const data= await connectionRequest.save()

       res.json({message:"connection request succefull",data})



    } catch (error) {
        res.send("error:"+error.message)
    }
})


requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const {status,requestId}=req.params;

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({message:"status is not valid"});
        }

        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"intrested"

        })

        if(!connectionRequest)
        {
            return res.status(400).json({message:"invalid connection"});
        }

        connectionRequest.status=status;

        const data=await connectionRequest.save();

        res.json({message:"connection request "+status,data})




    } catch (error) {
        res.send("error "+error.message)
    }
})

module.exports=requestRouter;
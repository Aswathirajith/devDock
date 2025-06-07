const mongoose=require('mongoose');
const User=require('../models/user')

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
         ref:User
    },
    status:{
        type:String,
        enum:{
            values:["ignored","intrested","accepted","rejected"],
            message:`{VALUES} is incorrect status type`
        }
    }
},{timestamps:true}

);

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre('save',function(next){
    const connectionrequest=this;

    if(connectionrequest.fromUserId.equals(connectionrequest.toUserId))
    {
         throw new Error("Cannot send connection request to yourself!");
    }

    next()
})

const connectionRequestModel=new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports=connectionRequestModel;
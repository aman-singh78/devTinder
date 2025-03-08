const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq");

const User_Safe_Data="firstName lastName age gender"

// get all the pending connection request for the loggedin user
userRouter.get("/user/request/received",userAuth, async(req,res)=>{
    try{
    const loggedInUser=req.user;
    const connectionRequests=await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status:"interested"
    }).populate("fromUserId",["firstName","lastName","age","gender"]);

    res.json({
        message:"data fetched successfully",
        data:connectionRequests
    })
    
    }
    catch(err){
        res.status(400).send("error "+err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req,res)=>{
    try{
       const loggedInUser=req.user;
       const connectionRequest=await ConnectionRequest.find({
        $or: [
            {toUserId: loggedInUser._id, status:"accepted"},
            {fromUserId: loggedInUser._id, status:"accepted"},
        ],
       }).populate("fromUserId",User_Safe_Data);

       const data=connectionRequest.map(row=> row.fromUserId);

       res.json({message: "connections fetched successfully",
              data
       }

       )
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
})

module.exports=userRouter;
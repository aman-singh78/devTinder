const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq");

// get all the pending connection request for the loggedin user
userRouter.get("/user/request/received",userAuth, async(req,res)=>{
    try{
    const loggedInUser=req.user;
    const connectionRequests=await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status:"interested"
    }).populate("fromUserId",["firstName","lastName"]);
    res.json({
        message:"data fetched successfully",
        data:connectionRequests
    })
    
    }
    catch(err){
        res.status(400).send("error "+err.message);
    }
})

module.exports=userRouter;
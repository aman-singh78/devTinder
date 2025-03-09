const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq");
const User = require("../models/user");

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
});

userRouter.get("/user/connections", userAuth, async (req,res)=>{
    try{
       const loggedInUser=req.user;
       const connectionRequest=await ConnectionRequest.find({
        $or: [
            {toUserId: loggedInUser._id, status:"accepted"},
            {fromUserId: loggedInUser._id, status:"accepted"},
        ],
       }).populate("fromUserId",User_Safe_Data)
         .populate("toUserId",User_Safe_Data);

       const data=connectionRequest.map((row)=>{
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }
        else{
            return row.fromUserId;
        }
       });

       res.json({message: "connections fetched successfully",
              data
       }

       )
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
});

userRouter.get("/feed",userAuth, async(req,res)=>{

     /*
      user should see all the user cards except
      his own card
      his connections
      ignored people
      already sent the connection request
      */

   try{
    const loggedInUser=req.user;

    const page=parseInt(req.query.page) || 1;
    let limit=parseInt(req.query.limit) || 10;
    limit=limit>50?50:limit;

    const skip=((page-1)*limit)

    // find all connection request (sent+recieved)
    const connectionRequest=await ConnectionRequest.find({
        $or:[
       {fromUserId: loggedInUser._id},
       {toUserId:loggedInUser._id}
        ]
    }).select("fromUSerId toUserId").skip(skip).limit(limit);

    const hideUsersFromFeed=new Set();
    connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId?.toString());
        hideUsersFromFeed.add(req.toUserId?.toString());
    })

   

    const users=await User.find({
       $and:[
        {_id:{ $nin: Array.from(hideUsersFromFeed)}},
        {_id:{ $ne:loggedInUser._id}}
       ]
    }).select(User_Safe_Data);



    res.send(users);
     
     
   }
   catch(err){
    res.status(400).json({
        message: err.message
    })
   }
})



module.exports=userRouter;
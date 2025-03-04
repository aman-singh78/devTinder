const express=require("express");
const requestrouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq");
const User=require("../models/user");
const mongoose=require("mongoose");
requestrouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
 try{
       const fromUserId=req.user._id;
       const toUserId=req.params.toUserId;
       const status=req.params.status;

        const allowedStatus=["ignored","interested"];
       if(!allowedStatus.includes(status)){
          return res.status(400).json({
            message:"Invalid status type " +status
          })
       };
      

       const checkUserPresentInDb=await User.findById(toUserId);
       if(!checkUserPresentInDb){
        return res.status(400).json({message:"This user is not present in my database"});
       };

    // check if there is an existing connectionRequest

       const existingConnectionRequest=await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
         ],
        
       });
       if(existingConnectionRequest){
        return res.status(400).send({message:"Connection Request already present"});
       }

       const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
       });

       const data=await connectionRequest.save();

       res.json({
        message:req.user.firstName +" is " + status + " in " +checkUserPresentInDb.firstName,
        data,
       })
 }
 catch(err){
    res.status(400).send("error "+err.message);
 }
   
});

requestrouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{

   // validate the status
   //Is loggedInUser is actually receiver i.e. toUserId
   //status should be interested
   //reqId should be valid

   try{
   const loggedInUser=req.user;
   const {status,requestId}=req.params;

   const allowedStatus=["rejected","accepted"];
   if(!allowedStatus.includes(status)){
     return res.status(400).json({message:"Status not allowed"});
   }
   

   const connectionRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
   });

   if(!connectionRequest){
      return res.status(404).json({message:"Connection Request not found"});
   }

   connectionRequest.status=status;

   const data= await connectionRequest.save();

   res.json({
      message:"Connection Request " + status,
      data
   })
   





   }
   catch(err){
      res.status(400).send("error " +err.message);
   }


})
module.exports=requestrouter;
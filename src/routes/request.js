const express=require("express");
const requestrouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionReq");
const User=require("../models/user");

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

module.exports=requestrouter;
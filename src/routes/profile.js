const express=require("express");
const profilerouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const {validateProfileEditData}=require("../utils/validation");


profilerouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
    const user=req.user;
    if(!user){
        throw new Error("please login again");
    }
    res.send(user);
    }
    catch(err){
        res.status(404).send("something went wrong " +err.message);
    }
});

profilerouter.patch("/profile/edit",userAuth,async (req,res)=>{
   try{
    if(!validateProfileEditData(req)){
        return res.staus(401).send("Invalid edit request");
    }

    const loggedInUser=req.user;
    // console.log(loggedInUser);

    Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

    await loggedInUser.save();

    res.send("profile updated successfully");



   }
   catch(err){
    res.status(404).send("something went wrong "+ err.message)
   }
});

module.exports=profilerouter;
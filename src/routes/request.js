const express=require("express");
const requestrouter=express.Router();
const {userAuth}=require("../middlewares/auth");

requestrouter.post("/sendConnectReq", userAuth, async(req,res)=>{

    res.send("connection req sent");
});

module.exports=requestrouter;
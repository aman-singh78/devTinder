const express=require("express");

const {handleMiddleware}=require("../middlewares/auth");

const app=express();

app.use("/admin",handleMiddleware);

app.get("/admin/getData",(req,res)=>{
    res.send("authentication is successfull");
});

app.get("/admin/delete",(req,res)=>{
    res.send("deleted user successfully");
})










app.listen(3000,()=>{
    console.log("server successfully listening on port : 3000");
});
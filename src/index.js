const express=require("express");

const {handleMiddleware}=require("../middlewares/auth");

const app=express();

app.use("/admin",handleMiddleware);

app.get("/admin/getData",(req,res)=>{
    try{
        res.send("authentication is successfull");
    }
    catch(err){
          res.send("uff something went wrong");
    }
    
});

app.use("/",(err,req,res,next)=>{   //order matters
       if(err){
        //log your errors
        res.status(500).send("something went wrong");
       }
})

app.get("/admin/delete",(req,res)=>{
    res.send("deleted user successfully");
})










app.listen(3000,()=>{
    console.log("server successfully listening on port : 3000");
});
const express=require("express");

const app=express();

app.use(
    "/user",
    (req,res,next)=>{
  console.log("In firsr response handler");
  res.send("response 1");
  next();
},(req,res)=>{
    console.log("In response 2");
    res.send("response 2");

});







app.listen(3000,()=>{
    console.log("server successfully listening on port : 3000");
});
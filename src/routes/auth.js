const express=require("express");
const authrouter=express.Router();
const { validateSignUpData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const User=require("../models/user");
authrouter.use(express.json()); 
const jwt=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
authrouter.use(cookieParser()); 

  authrouter.post("/signup",async (req,res)=>{
    //validation of data
    try{
    validateSignUpData(req);
    const {firstName,lastName,emailId,password}=req.body;
 
    //encrypt the password
    const passwordHash= await bcrypt.hash(password,10);
    console.log("hashed password is" +passwordHash);
 
  // creating a new instance of the User model
     const user=new User({
         firstName, 
         lastName,
         emailId,
          password: passwordHash
     });
       await user.save();
         res.send("user added successfully");
      }
      catch(err){
          res.status(404).send("error has occured" + err.message);
      }
 });

 authrouter.post("/login",async (req,res)=>{
    try{
       const {emailId,password}=req.body;
       const user=await User.findOne({emailId:emailId});
       if(!user){
        throw new Error("invalid credentials");
       }
        const isPasswordValid=await user.validatePassword(password);

        if(isPasswordValid){

            //Create a JWT token
           const token=await user.getJWT();

            //Add token to cookie and send back response to the user

            res.cookie("token",token);
          
            
            res.status(200).send("login successfull");
        }
        else{
            throw new Error("invalid credentials");
        }  
}
    catch(err){
        res.status(404).send("something went wrong" +err.message);
    }
});

authrouter.post("/logout",async (req,res)=>{
  res.cookie("token",null,{
    expires: new Date(Date.now()),
  });
  res.send("user logged out successfully");
});

module.exports=authrouter;
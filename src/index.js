const express=require("express");
const {connectDb}=require("./config/database");
const bcrypt=require("bcrypt");
const User=require("./models/user");
const { validateSignUpData}=require("./utils/validation");
const saltRound=10;
const app=express();
const port=3000;

app.use(express.json());  //middleware to read json data in server

app.post("/signup",async (req,res)=>{
   //validation of data
   try{
   validateSignUpData(req);
   const {firstName,lastName,emailId,password}=req.body;

   //encrypt the password
   const passwordHash= await bcrypt.hash(password,saltRound);
   console.log("hashed password is" +passwordHash);

 // creating a new instance of the User model
    const user=new User({
        firstName, lastName, emailId, password: passwordHash
    });
      await user.save();
        res.send("user added successfully");
     }
     catch(err){
         res.status(404).send("error has occured" + err.message);
     }
});
 
// Get user by email
app.get("/user",async (req,res)=>{
      const userEmail=req.body.emailId;
     try{
       const user= await User.find({emailId: userEmail});
       if(user.length===0){
        res.status(404).send("user not found");
       }
       else{
       res.send(user);
     }
    }
     catch(err){
        res.status(400).send("something went wrong");
     }
});
 
// Get all users from the database
app.get("/feed",async (req,res)=>{

 try{
     const user=await User.find({});
     res.send(user);
 }
 catch(err){
    res.status(400).send("something went wrong");
 }
});
 
// Delete a user from database
app.delete("/user",async (req,res)=>{
       const userId=req.body.userId;
       console.log(userId);

       try{
        const user=await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
       }
       catch(err){
      res.status(400).send("something went wrong");

       }
});

//Update a data of user
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;

    
    console.log(data);
    try{
        const allowedUpdates=["photoUrl","about","gender","age","skills"];

    const isUpdateAllowed=Object.keys(data).every((k)=>allowedUpdates.includes(k));

    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }

         const user=  await User.findByIdAndUpdate({_id:userId},data);
           res.send("User updated successfully");
    }
    catch(err){
        res.status(404).send("something went wrong");

    }
});

app.post("/login",async (req,res)=>{
    try{
       const {emailId,password}=req.body;
       const user=await User.findOne({emailId:emailId});
       if(!user){
        throw new Error("invalid credentials");
       }
        console.log(`${password} ${user.password}`);
        const isPasswordValid=await bcrypt.compare(password,user.password);

        if(isPasswordValid){
            res.status(200).send("login successfull");
        }
        else{
            throw new Error("invalid credentials");
        }  
}
    catch(err){
        res.status(404).send("something went wrong" +err.message);
    }
})



connectDb()
 .then(()=>{
    console.log("database connected successfully");
    app.listen(port,()=>{
        console.log(`server started at port ${port}`);
    })
})
 .catch((err)=>{
  console.log("database cannot be conneceted");
})
















const express=require("express");
const {connectDb}=require("./config/database");
const User=require("./models/user");
const app=express();
const port=3000;

app.post("/signup",async (req,res)=>{
    // creating a new instance of the User model
    const user=new User({
        firstName: "aman",
        lastName: "thapa",
        emailId: "aman@gmail.com",
        password: "aman07"
    });

     await user.save();
     res.send("user added successfully");
 
    


});

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
















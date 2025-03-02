const express=require("express");
const {connectDb}=require("./config/database");

const User=require("./models/user");
const cookieParser=require("cookie-parser");
const { validateSignUpData}=require("./utils/validation");
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth");
const saltRound=10;
const app=express();
const port=7000;

const authrouter=require("./routes/auth");
const profilerouter=require("./routes/profile");
const requestrouter=require("./routes/request");

app.use("/",authrouter);
app.use("/",profilerouter);
app.use("/",requestrouter);

app.use(express.json());  //middleware to read json data in server
app.use(cookieParser());



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
















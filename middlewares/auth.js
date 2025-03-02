const jwt=require("jsonwebtoken");
const User=require("../src/models/user");
const userAuth=async (req,res,next)=>{
    //Read the token from the request cookies
    // Validate the token
    // Find the user
   
    try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Token is not valid");
    }

    const decodedObj=await jwt.verify(token,"AMAN@7907");

    const {_id}=decodedObj;

    const user=await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
   req.user=user;
    next();
}
catch(err){
    res.status(404).send("something went wrong");
}
    

}

module.exports={
    userAuth
}
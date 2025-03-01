

const handleMiddleware=(req,res,next)=>{
    const token="xyz";
    const isAuth=token==="xyz";
    if(!isAuth){
        res.status(400).send("authentication failed");
    }
    else{
        next();
    }
   
}

module.exports={handleMiddleware};
const mongoose=require("mongoose");

const connectDb=async ()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017/DevTinder");
};


module.exports={connectDb};
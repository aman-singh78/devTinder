const mongoose=require("mongoose");
const { applyTimestamps } = require("./user");

const connectionRequestSchema=new mongoose.Schema({
     fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",// reference to user collection
        required:true
     },
     toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
     },
     status:{
        type:String,
        required:true,
        enum:{
            values: ["ignored","interested","accepted","rejected"],
           
        }
     }
},{
    timestamps:true,
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}); //compound index on both fromUserId and toUserId

connectionRequestSchema.pre("save", function(next){  //dont write arrow function
   const connectionRequest=this;
   //Check if the fromUserId is same as toUserId
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You can not send connection request to yourself");
   }
   next();
});

const ConnectionRequest=new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequest;
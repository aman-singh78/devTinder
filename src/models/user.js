const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        index:true,
        minLength:4,
        maxLength:50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email" +value);
            }
        }
    },
    password: {
        type:String,
        required: true,
    },
    age: {
        type:Number,
        min:18
    },
    gender: {
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type: String
    },
    about:{
        type : String,
        default:" this is a default about of user"
    },
    skills: {
        typr:[String]
    },
},
{
    timestamps:true
});

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id: user._id},"AMAN@7907",{expiresIn:"7d"});

   return token;
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const hashPassword=user.password;

    const isPasswordValid=await bcrypt.compare(passwordInputByUser,hashPassword);

    return isPasswordValid;
}

const User=mongoose.model("User",userSchema);

module.exports=User;
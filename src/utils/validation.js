const validator=require("validator");
const validateSignUpData=(req)=>{
   const {firstName,lastName,emailId,password}=req.body;

   if(!firstName || !lastName){
    throw new Error("name is invalid");
   }
   else if(firstName.length < 4 || firstName.length >50){
    throw new Error("name should be 4-50 chacarters");
   }

   else if(!validator.isEmail(emailId)){
    throw new Error("email is not valid");
   }

//    else if(!validator.isStrongPassword(password)){
//     throw new Error("enter a strong password");
//    }
}

module.exports={validateSignUpData}
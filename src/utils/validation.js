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
};

const validateProfileEditData=(req)=>{
   const allowedFields=["firstName","lastName","emailId","gender","age","about","skills"];

   const isAllowed=Object.keys(req.body).every((field)=> allowedFields.includes(field));

   return isAllowed;
}

module.exports={validateSignUpData,validateProfileEditData};
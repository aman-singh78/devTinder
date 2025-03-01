const express=require("express");

const app=express();



app.get("/user/:userId",(req,res)=>{
    console.log(req.params);
    res.send({firstName:" aman", LastName:"thapa"});
})

app.post("/user",(req,res)=>{
    console.log("save data to database");
    res.send("data successfully saved to database");
})

app.use("/test",(req,res)=>{       //request handler
    res.send("hello from the server");
});

app.delete("/user",(req,res)=>{
    res.send("deleted successfully");
})



app.listen(3000,()=>{
    console.log("server successfully listening on port : 3000");
});
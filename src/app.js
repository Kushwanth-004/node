const express = require("express");

const app = express();

app.use("/",(req,res) =>{
    res.send("hello");
});

app.use("/test",(req,res)=>{
    res.send("test");
})

app.listen(8888,()=>{
    console.log("Server created succesfully on port 8888");
});


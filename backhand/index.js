const express = require("express");
const mongoose = require('mongoose')
const {createServer} = require("node:http")
const {Server} = require("socket.io")
const cors= require("cors")
require('dotenv').config()
const app= express()  
const {ConnectToSocket}= require('./scr/controller/StocketManger.js')
const {SignUpValidate} = require('./scr/controller/SignUpValidate.js')
const {LoginValidate} = require('./scr/controller/SignUpValidate.js')
const {addToHistory,getUserHistory}= require('./scr/controller/SignUpValidate.js')
const {UserModel}= require('./scr/model/UserModel.js')
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

    
app.use(express.json());
app.use(express.urlencoded({extended:true})) 
app.use(cors());
app.use(bodyParser.json());
 
app.post('/SignUp',SignUpValidate)
app.post('/LoginUp',LoginValidate)
app.post("/addToHistory",addToHistory) 
app.get("/getUserHistory/:email",getUserHistory)  

 
const server = createServer(app);  
const io =  ConnectToSocket(server) 
app.get('/',(req,res)=>{  
    res.send("Done ")            
})    

server.listen((process.env.PORT),()=>{ 
               
    
    console.log("Shri Ganesh");   
    mongoose.connect(process.env.Moongose_URL)
    console.log(`Coonect on Port ${process.env.PORT}`);
    console.log(`http://localhost:${process.env.PORT}`); 
      
})
      
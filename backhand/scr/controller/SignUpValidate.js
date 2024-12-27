const {UserModel} = require('../model/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { MeetingModel } = require('../model/MeetingModel');

const SignUpValidate = async(req,res)=>{

    const {name,email,password}=req.body;
    try {
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
        res.status(200).json({success:false,message:"User Already Exist.Please Login"})
    }  
    else{
        let newUser = new UserModel({
            name:name,
            email:email, 
            password:password
        });
        newUser.password = await bcrypt.hash(password,10)
        await newUser.save();
        res.status(201).json({success:true,message:"SignUp Scessfully"})
    }     
    } catch (error) {
        console.log("Error in SignUp",error);
        res.status(500).json({
            message: "Internal server error in signUp",
            success: false,
        });
    }
    
}

const LoginValidate = async(req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        res.status(400).json({success:true,message:"Please Fill the details "})
    }
    else{ 
        const user = await UserModel.findOne({email})
        if(!user){
            res.status(400).json({success:false,message:"Please SignUp First "})
        }   
        else{

            const isPass = await bcrypt.compare(password,user.password)
            if(!isPass){
                res.status(401).json({success:false,message:"Invalid Credential"})
            }
            else{
                const jwtTOKEN = jwt.sign(
                    {email:user.email,_id:user._id},
                    process.env.JWT_KEY,
                    {expiresIn:'24h'}
            ) 
            res.status(200).json({success:true,message:"Login SuccessFul",jwtToken:jwtTOKEN,email:user.email})
            }
        }
    }

}

const  getUserHistory = async (req,res)=>{
   const {email}=req.params;
      
    try {

        const user = await UserModel.findOne({email:email})
        const meeting = await MeetingModel.find({userId:user._id})
        
        res.json(meeting)
    } catch (error) {
        console.log(error);
        }
}

let addToHistory = async(req,res)=>{
    const {token,email,meeting_code}=req.body;
    
    try {
        
        const user = await UserModel.findOne({email:email})
        
        const newMeeting = new MeetingModel({
            userId:user._id,
            email:email,
            meetingCode:meeting_code
        })
        
        await newMeeting.save();
        res.status(200).json({success:true,message:"Added SuccessFul"})

    } catch (error) {
        console.log("Error in addToHistory",error);
        res.status(500).json({
            message: "Internal server error in signUp",
            success: false,
        });
    }
}

module.exports = {SignUpValidate,LoginValidate,getUserHistory,addToHistory}

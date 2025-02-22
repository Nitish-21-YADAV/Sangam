const {Schema,model}= require('mongoose')

const UserSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,unique:true}
})

const  UserModel = new model("user",UserSchema);

module.exports ={UserModel}
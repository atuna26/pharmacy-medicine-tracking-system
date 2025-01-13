import mongoose from "mongoose";


const ActivitiesSchema = new mongoose.Schema({
    activityCode:{type:String,required:true},
    activityDate: {type:Date, default:new Date()}  
})
const UserSchema=new mongoose.Schema({
    firstName:{type:String,required:true,min:2},
    lastName:{type:String,required:true,min:2},
    email:{type:String,required:true,unique:true},
    phoneNumber:{type:String,unique:true},
    password:{type:String,required:true,min:5},
    picturePath:{type:String,default:"",},
    role:{type:String,required:true},
    activities:[ActivitiesSchema]
},{timestamps:true})
const User = mongoose.model("User",UserSchema)
export default User;

import mongoose, { Schema } from "mongoose"

const PatientSchema = new mongoose.Schema({
    firstName:{type:String,required:true,min:2},
    lastName:{type:String,required:true,min:2},
    email:{type:String,required:true,unique:true},
    address:{type:String},
    phoneNumber:{type:String},
    identifyNumber:{type:Number,unique:true,length:11},
    sex:{type:String,required:true},
    birthDate:{type:Date},
    bloodType:{type:String},
    alergies:[{type:String}],
    notes:{type:String},
    reports:[{type:Schema.Types.ObjectId,ref:"report"}]
},{timestamps:true})
const Patient = mongoose.model("Patient",PatientSchema)
export default Patient; 
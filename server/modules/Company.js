import mongoose from "mongoose";

const CompanySchema= new mongoose.Schema({
    name:{type:String},
    logoPath:{type:String,default:""},
    email:{type:String,required:true,unique:true},
    address:{type:String},
    phoneNumber:{type:String,unique:true},
})

const Company = mongoose.model("Company",CompanySchema)
export default Company
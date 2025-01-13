import mongoose, { Schema } from "mongoose"

const drugListSchema= new mongoose.Schema({
    drugName:{type:Schema.Types.ObjectId,ref:"drug"},
    quantity:{type:Number},
    income:{type:Number},
    expense:{type:Number},
})

const PrescriptionSchema= new mongoose.Schema({
    prescriptionNumber:{type:String,required:true},
    owner:{type:Schema.Types.ObjectId,ref:"patient"},
    drugList:[drugListSchema],
    date:{type:Date,default:new Date()},
})

const Prescription = mongoose.model("Prescription",PrescriptionSchema)
export default Prescription;
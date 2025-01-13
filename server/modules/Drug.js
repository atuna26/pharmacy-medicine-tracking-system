import mongoose, { Schema } from "mongoose";

const DrugSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  alergies: [{ type: String }],
  company:{type:Schema.Types.ObjectId,ref:"company"},
  alternatives:[{type:Schema.Types.ObjectId,ref:"drug"}],
  day:{type:Number},
  quantity:{type:Number},
  debt:{type:Number},
  cost:{type:Number},
  arrivalPrice:{type:Number},
  salePrice:{type:Number},
},{timestamps:true});

const Drug=mongoose.model("Drug",DrugSchema)
export default Drug
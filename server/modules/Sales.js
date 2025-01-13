import mongoose, { Schema } from "mongoose";

const drugListSchema = new mongoose.Schema({
    drugName:{type:Schema.Types.ObjectId,ref:"drug"},
    isRepeat:{type:Boolean},
    repeatDate:{type:Date},
    quantity:{type:Number},
    income:{type:Number},
    expense:{type:Number},
    isDebt:{type:Boolean},
    onCredit:{type:Boolean},
    debtFinishDate:{type:Date},
    isDebtClosed:{type:Boolean},
    debtClosedDate:{type:Date},
    onCreditClosed:{type:Boolean},
    onCreditClosedDate:{type:Date},
})

const ItemListSchema = new mongoose.Schema({
    itemName:{type:String},
    quantity:{type:Number},
    income:{type:Number},
    expense:{type:Number},
})

const SalesSchema = new mongoose.Schema({
    itemList:[ItemListSchema],
    drugList:[drugListSchema],
    customerName:{type:Schema.Types.ObjectId,ref:"patients"},
    type:{type:String},
    date:{type:String,default:new Date()},
})

const Sales = mongoose.model("Sales",SalesSchema);
export default Sales;
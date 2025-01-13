import mongoose, { Schema } from "mongoose";

const transactionItemListSchema = new mongoose.Schema({
    item:{type:Schema.Types.ObjectId,ref:"product"},
    quantity:{type:Number},
    singlePrice:{type:Number,},
})

const transactionDrugListSchema = new mongoose.Schema({
    drug:{type:Schema.Types.ObjectId,ref:"drug"},
    quantity:{type:Number},
    singlePrice:{type:Number,},
})

const TransactionSchema = new mongoose.Schema({
    owner:{type:Schema.Types.ObjectId,ref:"user"},
    transactionItemList:[transactionItemListSchema],
    transactionDrugList:[transactionDrugListSchema],
    transactionType:{type:String,required:true},
    note:{type:String,},
    date:{type:Date,default: new Date()},

})

const Transaction = mongoose.model("Transaction",TransactionSchema)
export default Transaction;
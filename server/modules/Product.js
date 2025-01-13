import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{type:String,required:true},
    code:{type:String,required:true},
    company:{type:String,},
    category:{type:String,required:true},
    quantity:{type:Number,default:0},
    arrivalPrice:{type:Number},
    salePrice:{type:Number},
})
const Product = mongoose.model("Product",ProductSchema)
export default Product;

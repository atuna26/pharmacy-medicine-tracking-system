import Product from "../modules/Product.js";

export const getProductList = async (req,res)=>{
    try{
        const product = await Product.find({});
        res.status(200).json(product)
    }catch(err){
        res.status(404).json({message:err.message})
    }
} 

export const getProduct = async(req,res)=>{
    try{
        const product= await Product.findById(req.params.id);
        res.status(200).json(product)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const increaseQuantity = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        product.quantity++
        await product.save();
        res.status(200).json(product.quantity)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}
export const decreaseQuantity = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        product.quantity--;
        await product.save();
        res.status(200).json(product.quantity)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const changeArrivalPrice = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        product.arrivalPrice = req.params.arrivalPrice
        await product.save()
        res.status(200).json(product)

    }catch(err){
        res.status(404).json({message:err.message})
    }
}
export const changeSalePrice = async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        product.salePrice = req.params.salePrice
        await product.save()
        res.status(200).json(product)

    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const newProduct = async(req,res)=>{
    try{
        const product = await Product.create({...req.body});
        res.status(201).json(product)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}   
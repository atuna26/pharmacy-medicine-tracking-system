import Transaction from "../modules/Transaction.js";
import User from "../modules/User.js"
import Drug from "../modules/Drug.js";
import Product from "../modules/Product.js";

export const getTransactionList = async (req,res)=>{
    try{
        let transactions = await Transaction.find({}).populate({path:"owner",model:User}).populate({path:"transactionItemList.item",model:Product}).populate({path:"transactionDrugList.drug",model:Drug});
        transactions=transactions.map(transaction=>{
            let total = 0;
            transaction.transactionItemList.forEach((listItem)=>{
               total= listItem.quantity*listItem.singlePrice
               
            })
            transaction.transactionDrugList.forEach((listItem)=>{
                total= listItem.quantity*listItem.singlePrice
             })
            return{
                ...transaction.toObject(),
                total,
            }
        })
        res.status(200).json(transactions)
    }catch(err){
        console.log(err)
        res.status(404).json({message:err.message})
    }
} 

export const newTransaction = async(req,res)=>{
    try{
        const transaction = await Transaction.create({...req.body});
        if(transaction.transactionType==="Alış"){
            for(const listItem of transaction.transactionItemList){
                const product = await Product.findById(listItem.drug)
                product.quantity += listItem.quantity
                if(product.cost==0){
                    product.cost = listItem.singlePrice;
                } //MALİYETİ HESAPLARKEN SADECE TEKİL FİYAT + ESKİ FİYAT MI YOKSA MİKTARI DA ALACAK MIYIZ DEVREYE
                await product.save()
            }
            for(const listItem of transaction.transactionDrugList){
                const drug = await Drug.findById(listItem.drug)
                drug.quantity += listItem.quantity
                if(drug.cost==0){
                    drug.cost = listItem.singlePrice;
                } //MALİYETİ HESAPLARKEN SADECE TEKİL FİYAT + ESKİ FİYAT MI YOKSA MİKTARI DA ALACAK MIYIZ DEVREYE
                await drug.save();
            }

        }
        res.status(201).json(transaction)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const editTransaction = async(req,res)=>{
    try{
        const transaction = await Transaction.findById(req.params.id)
        await Object.assign(transaction,req.body);
        await transaction.save();
        res.status(200).json(transaction);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}
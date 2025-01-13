import Prescription from "../modules/Prescription.js";

export const getPrescription = async (req,res)=>{
    try{
        const prescription = await Prescription.findById(req.params.id)
        res.status(200).json(prescription)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const getPrescriptionList = async (req,res)=>{
    try{
    const prescription = await Prescription.find({})
    res.status(200).json(prescription);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const editPrescription = async(req,res)=>{
    try{
        const prescription = await Prescription.findById(req.params.id)
        await Object.assign(prescription,req.body);
        await prescription.save();
        res.status(200).json(prescription)
    }catch(err){
        res.status(404).json({message:err.message});
    }
}
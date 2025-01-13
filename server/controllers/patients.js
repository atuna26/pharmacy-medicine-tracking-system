import Patient from "../modules/Patient.js"
import Prescription from "../modules/Prescription.js"

export const getPatient = async (req,res)=>{
    try{
        const patient = Patient.findById(req.params.id)
        res.status(200).json(patient);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}
export const getPatientList = async (req,res)=>{
    try{
        const patient = await Patient.find({})
        res.status(200).json(patient);
    }catch(err){
        res.status(404).json({message:err.message})
    }
}
export const getPatientPrescription = async (req,res)=>{
    try{
        const patient = await Patient.findById(req.params.id);
        const prescription = await Prescription.find({owner:patient._id})
        res.status(200).json(patient,prescription)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}
export const setPatientData = async (req,res)=>{
    try{
        const patient = await Patient.findById(req.params.id);
        await Object.assign(patient,req.body)
        await patient.save();
        res.status(200).json(patient)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const newPatient = async (req,res)=>{
    try{
       const patient = await Patient.create({...req.body});
       res.status(201).json(patient)
    }catch(err){
        console.log(err)
    }
}
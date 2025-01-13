import User from "../modules/User.js";

export const getUser= async(req,res)=>{
    try{
        const {id}=req.params;
        const user = await User.findById(id);
        res.status(200).json(user)
    }catch(err){res.status(404).json({message:err.message})}
}

export const getActivities = async(req,res)=>{
    try{
        const {id}=req.params;
        const user = await User.findById(id)
        res.status(200).json(user.activities)
    }catch(err){res.status(404).json({message:err.message})}
}

export const newActivities = async(req,res)=>{
    try{
        const {id,activityCode}=req.params;
        const user = await User.findById(id)
        user.activities.push({activityCode:activityCode})
        await user.save();
        res.status(200).json(user.activities)
    }catch(err){res.status(404).json({message:err.message})}
}


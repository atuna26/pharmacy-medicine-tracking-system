import Drug from "../modules/Drug.js";

export const getDrugList = async (req, res) => {
  try {
    const drug = await Drug.find({});
    res.status(200).json(drug);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getDrug = async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    res.status(200).json(drug);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editQuantity = async(req,res)=>{
  try{
    for (const drugs of req.body){
      const drug = await Drug.findById(drugs._id);
      drug.quantity=drugs.quantity;
      await drug.save()
    }
    res.status(200).json(req.body);
  }catch(err){
    res.status(404).json({message:err.message})
  }
}


export const increaseDebt = async(req,res)=>{
  try{
    const drug = await Drug.findById(req.params.id);
    drug.debt = drug.debt + 1;
    await drug.save();
    res.status(200).json(drug.debt)

  }catch(err){
    res.status(404).json({message:err.message})
  }
}

export const decreaseDebt = async(req,res)=>{
  try{
    const drug = await Drug.findById(req.params.id);
    if(drug.debt != 0)
    drug.debt = drug.debt - 1;
    await drug.save();
    res.status(200).json(drug.debt)
  }catch(err){
    res.status(404).json({message:err.message})
  }
}

export const changeArrivalPrice = async(req,res)=>{
  try{
    const {id,arrivalPrice} = req.params;
    const drug = await Drug.findById(id);
    drug.arrivalPrice = arrivalPrice;
    await drug.save();
    res.status(200).json(drug.arrivalPrice)
  }catch(err){
    res.status(404).json({message:err.message})
  }
}


export const changeSalePrice = async(req,res)=>{
  try{
    const {id,salePrice} = req.params;
    const drug = await Drug.findById(id);
    drug.salePrice = salePrice;
    await drug.save();
    res.status(200).json(drug.salePrice)
  }catch(err){
    res.status(404).json({message:err.message})
  }
}
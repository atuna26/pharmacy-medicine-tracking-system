import Sales from "../modules/Sales.js";
import Patient from "../modules/Patient.js";
import Drug from "../modules/Drug.js";
import Product from "../modules/Product.js";
import Transaction from "../modules/Transaction.js";
export const getSalesWithPrescription = async (req, res) => {
  try {
    let sales = await Sales.find({ type: "Reçeteli" })
      .populate({ path: "customerName", model: Patient })
      .populate({ path: "drugList.drugName", model: Drug });
    sales = sales.map((sale) => {
      let total = 0;
      sale.drugList.forEach((drug) => {
        total += drug.quantity * drug.expense;
      });
      return {
        ...sale.toObject(), // Mongoose belgeyi düz bir JavaScript nesnesine çeviriyoruz
        total, // total'i ekliyoruz
      };
    });
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSalesWithoutPrescription = async (req, res) => {
  try {
    let sales = await Sales.find({ type: "Reçetesiz" })
      .populate({ path: "customerName", model: Patient })
      .populate({ path: "drugList.drugName", model: Drug });
    sales = sales.map((sale) => {
      let total = 0;
      sale.drugList.forEach((drug) => {
        total += drug.quantity * drug.expense;
      });
      sale.itemList.forEach((item) => {
        total += item.quantity * item.expense;
      });
      return {
        ...sale.toObject(), // Mongoose belgeyi düz bir JavaScript nesnesine çeviriyoruz
        total, // total'i ekliyoruz
      };
    });
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSale = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id);
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getDebtList = async (req, res) => {
  try {
    const sales = await Sales.find({
      drugList: {
        $elemMatch: {
          isDebt: true,
          isDebtClosed: false,
        },
      },
    })
      .populate({ path: "customerName", model: Patient })
      .populate({ path: "drugList.drugName", model: Drug });
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getOnCreditList = async (req, res) => {
  try {
    const sales = await Sales.find({
      drugList: {
        $elemMatch: {
          onCredit: true,
          onCreditClosed: false,
        },
      },
    })
      .populate({ path: "customerName", model: Patient })
      .populate({ path: "drugList.drugName", model: Drug });
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editSales = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id);
    await Object.assign(sales, req.body);
    await sales.save();
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const closeOnCredit = async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.id);
    sales.drugList.forEach((drug) => {
      drug.onCreditClosed = true;
      drug.onCreditClosedDate = new Date();
    });
    await sales.save();
    res.status(200).json(sales);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const newSale = async (req, res) => {
  try {
    const { drugList, itemList } = req.body;
    const currentDate = new Date();
    for (const drug of drugList) {
      const drugData = await Drug.findById(drug.drugName);
      if (drugData) {
        drug.income = drugData.arrivalPrice;
        if (!drug.expense || drug.expense === 0)
          drug.expense = drugData.salePrice;
        drugData.quantity -= drug.quantity;
        await drugData.save();
      }
      if (drug.isRepeat == true) {
        const repeatDate = new Date(currentDate);
        drug.repeatDate = repeatDate.setDate(
          repeatDate.getDate() + drugData.day
        );
      }
      if (drug.isDebt == true) {
        const debtFinishDate = new Date(currentDate);
        drug.debtFinishDate = debtFinishDate.setDate(
          debtFinishDate.getDate() + 7
        );
        drugData.debt += drug.quantity;
        await drugData.save();
        drug.isDebtClosed = false;
      }
      if (drug.onCredit == true) {
        const debtFinishDate = new Date(currentDate);
        drug.debtFinishDate = debtFinishDate.setDate(
          debtFinishDate.getDate() + 7
        );
        drug.onCreditClosed = false;
      }
    }

    for (const item of itemList) {
      const product = await Product.findById(item.itemName);
      if (product) {
        item.income = product.arrivalPrice;
        //  item.expense = product.salePrice;
        product.quantity -= item.quantity;
        await product.save();
      }
    }
    const sales = await Sales.create({ ...req.body });
    const transactionItemList = [];
    const transactionDrugList = [];

    sales.itemList.forEach((item) => {
      transactionItemList.push({
        item: item.itemName,
        quantity: item.quantity,
        singlePrice: item.expense,
      });
    });

    sales.drugList.forEach((drug) => {
      transactionDrugList.push({
        drug: drug.drugName,
        quantity: drug.quantity,
        singlePrice: drug.expense,
      });
    });

    const transaction = await Transaction.create({
      transactionType: "Satış",
      transactionItemList,
      transactionDrugList,
      owner: req.body.owner,
    });
    console.log(transaction);
    res.status(200).json(sales);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

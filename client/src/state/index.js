import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  mode: "light",
  drugs: [],
  patients:[],
  prescriptions:[],
  transactions:[],
  products:[],
  companies:[],
  accounts:[],
  settings:{},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setDrugs: (state, action) => {
      state.drugs = action.payload;
    },
    setPatient:(state,action)=>{
      state.patients = action.payload
    },
    setPrescription:(state,action)=>{
      state.prescriptions=action.payload;
    },
    setProducts:(state,action)=>{
      state.products=action.payload;
    },
    setTransactions:(state,action)=>{
      state.transactions=action.payload;
    },
    setSettings:(state,action)=>{
      state.settings=action.payload;
    },
    setCompanies:(state,action)=>{
      state.companies=action.payload;
    },
    setAccounts:(state,action)=>{
      state.accounts=action.payload
    },
    updateProductQuantity:(state,action)=>{
      const {id,quantity}=action.payload;
      const product = state.products.find((product)=>product._id===id);
      if(product){
        product.quantity=quantity;
      }
    },
    updateDrugQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const drug = state.drugs.find((drug) => drug._id === id);
      if (drug) {
        drug.quantity = quantity;
      }
    },
    updateDrugDebt: (state, action) => {
      const { id, debt } = action.payload;
      const drug = state.drugs.find((drug) => drug._id === id);
      if (drug) {
        drug.debt = debt;
      }
    },
  },
});

export const { setLogin, setLogout, setDrugs,setPrescription ,setProducts,setPatient,setTransactions,setSettings,setCompanies,setAccounts,updateDrugQuantity,updateDrugDebt,updateProductQuantity} = authSlice.actions;

export default authSlice.reducer;

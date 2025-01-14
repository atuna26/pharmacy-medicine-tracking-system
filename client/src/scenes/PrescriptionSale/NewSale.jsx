import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  TableRow,
  styled,
  TableHead,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Modal,
  Icon,
} from "@mui/material";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { setDrugs, setPatient, setPrescription, setProducts } from "state";
import React, { useEffect, useState,useRef, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { AlertContext } from "components/AlertContext";

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const drugListSchema = yup.object().shape({
  drugName: yup.string(), // ObjectId olarak kaydedilen referanslar, yup'ta string olarak ele alınır
  quantity: yup.number(),
  expense: yup.number(),
  tax:yup.number(),
  diffrence:yup.number(),
  isDebt: yup.boolean(),
  isRepeat: yup.boolean(),
  onCredit: yup.boolean(),
});

const itemListSchema = yup.object().shape({
  itemName: yup.string(),
  quantity: yup.number(),
  tax:yup.number(),
  expense: yup.number(),
});

const SalesSchema = yup.object().shape({
  itemList: yup.array().of(itemListSchema),
  drugList: yup.array().of(drugListSchema),
  customerName: yup.string().required("*zorunlu"), // Mongoose'da ObjectId olan bu alan, Yup'ta string olarak ele alınır
  type: yup.string().required("*zorunlu"),
  date: yup.date().default(() => new Date()),
});

// Başlangıç değerleri için
const initialValuesSale = {
  itemList: [],
  drugList: [],
  customerName: "",
  type: "",
};

const NewSale = () => {
  const dispatch = useDispatch();
  const {showAlert} = useContext(AlertContext)
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state)=>state.user)
  const drugs = useSelector((state) => state.drugs);
  const products = useSelector((state) => state.products);
  const patients = useSelector((state) => state.patients);
  const prescriptions = useSelector((state) => state.prescriptions);
  let scannerIndex=0;

  const [alternativeSuggest, setAlternativeSuggest] = useState(false);
  const [alternativeModalText, setAlternativeModalText] = useState(null);
  const [patientDebt, setPatientDebt] = useState(false);
  const [patientDebtModalText, setPatientDebtModalText] = useState(null);
  const handleAlternativeModalClose = () => {
    setAlternativeSuggest(false);
  };

  const handlePatientDebtModalClose = () =>{
    setPatientDebt(false);
  }

  const getDebtList = async () => {
    const response = await fetch("http://localhost:3001/satis/borc-bilgi", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPrescription(data));
  };

  const getDrugList = async () => {
    const response = await fetch(`http://localhost:3001/ilac/tum-ilaclar`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setDrugs(data));
  };
  const getPatientList = async () => {
    const response = await fetch(`http://localhost:3001/hasta-bilgi/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPatient(data));
  };
  const getProductList = async () => {
    const response = await fetch(`http://localhost:3001/urun/tum-urunler`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setProducts(data));
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    
    const newSaleResponse = await fetch(
      `http://localhost:3001/satis/yeni-satis`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...values,owner:user._id}),
      }
    );
    const newSale = await newSaleResponse.json();
    showAlert(` ${patients.find((patient)=> patient._id === newSale.customerName).firstName }  ${patients.find((patient)=> patient._id === newSale.customerName).lastName } adlı kişiye satış başarıyla gerçekleştirildi.`,"success")

    onSubmitProps.resetForm();
  };

  useEffect(() => {
    getPatientList();
    getDrugList();
    getProductList();
    getDebtList();
    document.title = "EYS BETA 0.1.0 - Yeni Satış";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const drugPriceChange = async (
    event,
    index,
    setFieldValue,
    setFieldError
  ) => {
    const selectedDrug = document.getElementsByName(
      `drugList[${index}].drugName`
    )[0].value;
    const drug = drugs.find((drug) => drug._id === selectedDrug);
    const priceQuantity = document.getElementsByName(
      `drugList[${index}].quantity`
    );
    if (drug) {
      const newPrice = drug.salePrice * priceQuantity[0].value;
      setFieldValue(`drugList[${index}].expense`, newPrice);
      setFieldValue(`drugList[${index}].tax`,newPrice*1/100)
    }
    if (drug.quantity < priceQuantity[0].value) {
      setFieldError(`drugList[${index}].quantity`, "Stoktaki miktardan fazla!");
      setAlternativeSuggest(true);
      setAlternativeModalText(
        <Box>
          <p>
            Seçilen ilaç <strong>{drug.name}</strong> stokta sadece{" "}
            <strong>{drug.quantity}</strong> adet bulunmaktadır.{" "}
          </p>
          <p>
            İlacın alış fiyatı <strong>{drug.arrivalPrice}₺</strong> İlacın
            satış fiyatı <strong>{drug.salePrice}₺</strong>.
          </p>
          <p>Lütfen aşağıdaki alternatif ilaçlardan birini seçiniz:</p>
          <Stack>
            {drug.alternatives.map((alternative) => (
              <Button key={alternative}
                type="button" sx={{mt:1}}
                onClick={() => {
                  setFieldValue(`drugList[${index}].drugName`, alternative);
                  setAlternativeSuggest(false);
                  setTimeout(() => {
                    drugPriceChange(event, index, setFieldValue, setFieldError);
                  }, 0);
                }}
                variant="contained" 
              >
                {" "}
                {drugs.find((drug) => drug._id === alternative).name} (
                {drugs.find((drug) => drug._id === alternative).quantity} adet)
                (Alış:
                {drugs.find((drug) => drug._id === alternative).arrivalPrice}₺)
                (Satış:
                {drugs.find((drug) => drug._id === alternative).salePrice}₺)
              </Button>
            ))}
          </Stack>
        </Box>
      );
    } else {
      setFieldError(`drugList[${index}].quantity`, ""); // Hata yoksa hata mesajını temizle
    }
  };

  const itemPriceChange = async (
    event,
    index,
    setFieldValue,
    setFieldError
  ) => {
    const item = products.find(
      (product) =>
        product._id ===
        document.getElementsByName(`itemList[${index}].itemName`)[0].value
    );
    const priceQuantity = document.getElementsByName(
      `itemList[${index}].quantity`
    );
    if (item) {
      const newPrice = item.salePrice * priceQuantity[0].value;
      setFieldValue(`itemList[${index}].expense`, newPrice);
      setFieldValue(`itemList[${index}].tax`,newPrice*10/100)

    }
    if (item.quantity < priceQuantity[0].value) {
      setFieldError(`itemList[${index}].quantity`, "Stoktaki miktardan fazla!");
    } else {
      setFieldError(`itemList[${index}].quantity`, ""); // Hata yoksa hata mesajını temizle
    }
  };

  const patientChange = () => {
    const patient = patients.find(
      (patient) => patient._id === document.getElementsByName(`customerName`)[0].value
    );
    const prescription = prescriptions.find((prescription)=> prescription.customerName._id===document.getElementsByName(`customerName`)[0].value)
    console.log(prescriptions[0].customerName._id)
    console.log(document.getElementsByName(`customerName`)[0].value)
    console.log(prescription)
    if(prescription){
      const debtCheck = prescription.drugList.find((drug)=>drug.isDebt && !drug.isDebtClosed);
      if(debtCheck){
        console.log(debtCheck)
        setPatientDebt(true);
        setPatientDebtModalText(<Box>
        <p> <strong>{patient.firstName} {patient.lastName}</strong> adlı hastanın borcu bulunmaktadır.</p>
        <p>İlaç adı: <strong>{debtCheck.drugName.name} ({debtCheck.quantity} adet)</strong></p>
        <p>İlaç reçeteye eklendiği taktirde borç silinecektir.</p>
        <p> <strong>Lütfen ilacı teslim ederken {debtCheck.quantity} adet eskik veriniz.</strong></p>
        </Box>)
      }
    }
  };

  /* BARCODE READER */
  const scannerRef= useRef(null)
  const scanned = (e,index,setFieldValue) =>{
    if(e.target.files.length ===0){
      return;
    }
    const imageFile = e.target.files[0];
    if(scannerRef.current){
      scannerRef.current.scanFile(imageFile,false).then(qrCodeMessage=>{
        setFieldValue(`drugList[${index}].drugName`,qrCodeMessage)
      })
    }
  }

  
  return (
    <Box flex={4} p={2}>
       
      <Box width="100%" height="50px">
        Yeni Satış
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesSale}
        validationSchema={SalesSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          setFieldError,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              mr={2}
              gridTemplateColumns="repeat(8,minmax(0,1fr))"
            >
              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Müşteri Adı</InputLabel>
                <Select
                  label="Müşteri Adı"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setTimeout(() => {
                      patientChange();
                    }, 0);
                  }}
                  value={values.customerName}
                  name="customerName"
                  error={
                    Boolean(touched.customerName) &&
                    Boolean(errors.customerName)
                  }
                  helperText={touched.customerName && errors.customerName}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient._id} value={patient._id}>
                      {patient.firstName} {patient.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Satış Tipi</InputLabel>
                <Select
                  label="Satış Tipi"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.type}
                  name="type"
                  error={Boolean(touched.type) && Boolean(errors.type)}
                  helperText={touched.type && errors.type}
                >
                  <MenuItem value="Reçeteli">Reçeteli Satış</MenuItem>
                  <MenuItem value="Reçetesiz">Reçetesiz Satış</MenuItem>
                </Select>
              </FormControl>
              <FieldArray
                name="drugList"
                render={(arrayHelpers) => (
                  <>
                    <TableContainer
                      sx={{ gridColumn: "span 8" }}
                      component={Paper}
                    >
                      <Table sx={{ minWidth: 700 }}>
                        <StyledTableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              İlaç Adı
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Miktar
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "5%",
                              }}
                            >
                              Borç
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "5%",
                              }}
                            >
                              Veresiye
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "5%",
                              }}
                            >
                              Tekrarlı
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Fark
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Vergi
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Satış Fiyatı
                            </TableCell>
                          </TableRow>
                        </StyledTableHead>
                        <TableBody>
                          {values.drugList.map((drug, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                <FormControl fullWidth>
                                  <InputLabel>İlaç {index + 1}</InputLabel>
                                  <Select
                                    label={`İlaç ${index + 1}`}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setTimeout(() => {
                                        drugPriceChange(
                                          e,
                                          index,
                                          setFieldValue,
                                          setFieldError
                                        );
                                      }, 0);
                                    }}
                                    value={values.drugList?.[index]?.drugName}
                                    name={`drugList[${index}].drugName`}
                                    error={Boolean(
                                      touched.drugList?.[index]?.drugName &&
                                        errors.drugList?.[index]?.drugName
                                    )}
                                  >
                                    {drugs.map((drug) => (
                                      <MenuItem key={drug._id} value={drug._id}>
                                        {drug.name}
                                      </MenuItem>
                                    ))}
                                    <MenuItem value="1234567890913">Fucicort Krem 20 mg</MenuItem>
                                    <MenuItem value="01234565">Galvus 50 mg Tablet</MenuItem>
                                  </Select>
                                </FormControl>
                                <div id={`barcode-reader[${index}]`}>
                                <input type="file" id="qr-input-file" onChange={(e)=>scanned(e,index,setFieldValue)}  accept="image/*"/>

                                </div>

                              
                    
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  label="Miktar"
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                    drugPriceChange(
                                      e,
                                      index,
                                      setFieldValue,
                                      setFieldError
                                    );
                                  }}
                                  value={values.drugList?.[index]?.quantity}
                                  name={`drugList[${index}].quantity`}
                                  type="number"
                                  error={Boolean(
                                    touched.drugList?.[index]?.quantity &&
                                      errors.drugList?.[index]?.quantity
                                  )}
                                />
                              </TableCell>
                              <TableCell align="left">
                                <FormControlLabel
                                  label="Borç"
                                  control={
                                    <Checkbox
                                      color="secondary"
                                      name={`drugList[${index}].isDebt`}
                                      checked={
                                        values.drugList?.[index]?.isDebt ||
                                        false
                                      }
                                      onChange={(event) => {
                                        setFieldValue(
                                          `drugList[${index}].isDebt`,
                                          event.target.checked
                                        );
                                      }}
                                    />
                                  }
                                />
                              </TableCell>
                              <TableCell align="left">
                                <FormControlLabel
                                  label="Veresiye"
                                  control={
                                    <Checkbox
                                      color="secondary"
                                      name={`drugList[${index}].onCredit`}
                                      checked={
                                        values.drugList?.[index]?.onCredit ||
                                        false
                                      }
                                      onChange={(event) => {
                                        setFieldValue(
                                          `drugList[${index}].onCredit`,
                                          event.target.checked
                                        );
                                      }}
                                    />
                                  }
                                />
                              </TableCell>
                              <TableCell align="left">
                                <FormControlLabel
                                  label="Tekrarlı"
                                  control={
                                    <Checkbox
                                      color="info"
                                      name={`drugList[${index}].isRepeat`}
                                      checked={
                                        values.drugList?.[index]?.isRepeat ||
                                        false
                                      }
                                      onChange={(event) => {
                                        setFieldValue(
                                          `drugList[${index}].isRepeat`,
                                          event.target.checked
                                        );
                                      }}
                                    />
                                  }
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  label="Fark"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.drugList?.[index]?.diffrence}
                                  name={`drugList[${index}].diffrence`}
                                  type="number"
                                  error={Boolean(
                                    touched.drugList?.[index]?.diffrence &&
                                      errors.drugList?.[index]?.diffrence
                                  )}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  label="Vergi"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.drugList?.[index]?.tax}
                                  name={`drugList[${index}].tax`}
                                  type="number"
                                  error={Boolean(
                                    touched.drugList?.[index]?.tax &&
                                      errors.drugList?.[index]?.tax
                                  )}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  label="Satış Fiyatı"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.drugList?.[index]?.expense}
                                  name={`drugList[${index}].expense`}
                                  type="number"
                                  error={Boolean(
                                    touched.drugList?.[index]?.expense &&
                                      errors.drugList?.[index]?.expense
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{ gridColumn: "span 1" }}
                      onClick={(index) =>{

                      
                        arrayHelpers.push({
                          drugName: "",
                          quantity: 1,
                          expense: 0,
                          tax:0,
                          diffrence:0,
                          isRepeat: false,
                          isDebt: false,
                          onCredit: false,
                        })
                        setTimeout( function() {const barcodeScanner = new Html5Qrcode(`barcode-reader[${scannerIndex}]`, { fps: 10, qrbox: 250 });
                        scannerRef.current=barcodeScanner;scannerIndex++},100)
                        
                        }
                      }
                    >
                      Yeni İlaç Ekle
                    </Button>
                  </>
                )}
              />

              <FieldArray
                name="itemList"
                render={(arrayHelpers) => (
                  <>
                    <TableContainer
                      sx={{ gridColumn: "span 8" }}
                      component={Paper}
                    >
                      <Table sx={{ minWidth: 700 }}>
                        <StyledTableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              Ürün Adı
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Miktar
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Vergi
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Satış Fiyatı
                            </TableCell>
                          </TableRow>
                        </StyledTableHead>
                        <TableBody>
                          {values.itemList.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                <FormControl fullWidth>
                                  <InputLabel>Ürün {index + 1}</InputLabel>
                                  <Select
                                    label={`Ürün ${index + 1}`}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                      handleChange(e);
                                      setTimeout(() => {
                                        itemPriceChange(
                                          e,
                                          index,
                                          setFieldValue,
                                          setFieldError
                                        );
                                      }, 0);
                                    }}
                                    value={values.itemList?.[index]?.itemName}
                                    name={`itemList[${index}].itemName`}
                                    error={Boolean(
                                      touched.itemList?.[index]?.itemName &&
                                        errors.itemList?.[index]?.itemName
                                    )}
                                    helperText={
                                      touched.itemList?.[index]?.itemName &&
                                      errors.itemList?.[index]?.itemName
                                    }
                                  >
                                    {products.map((product) => (
                                      <MenuItem
                                        key={product._id}
                                        value={product._id}
                                      >
                                        {product.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  label="Miktar"
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    handleChange(e);
                                    itemPriceChange(
                                      e,
                                      index,
                                      setFieldValue,
                                      setFieldError
                                    );
                                  }}
                                  value={values.itemList?.[index]?.quantity}
                                  name={`itemList[${index}].quantity`}
                                  type="number"
                                  error={Boolean(
                                    touched.itemList?.[index]?.quantity &&
                                      errors.itemList?.[index]?.quantity
                                  )}
                                  helperText={
                                    touched.itemList?.[index]?.quantity &&
                                    errors.itemList?.[index]?.quantity
                                  }
                                />
                              </TableCell>

                              <TableCell align="right">
                                <TextField
                                  label="Vergi"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.itemList?.[index]?.tax}
                                  name={`itemList[${index}].tax`}
                                  type="number"
                                  error={Boolean(
                                    touched.itemList?.[index]?.tax &&
                                      errors.itemList?.[index]?.tax
                                  )}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  label="Satış Fiyatı"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.itemList?.[index]?.expense}
                                  name={`itemList[${index}].expense`}
                                  type="number"
                                  error={Boolean(
                                    touched.itemList?.[index]?.expense &&
                                      errors.itemList?.[index]?.expense
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Button
                      type="button"
                      variant="contained"
                      sx={{ gridColumn: "span 2" }}
                      onClick={() =>
                        arrayHelpers.push({
                          itemName: "",
                          tax:0,
                          quantity: 1,
                          expense: 0,
                        })
                      }
                    >
                      Yeni Ürün Ekle
                    </Button>
                  </>
                )}
              />
            </Box>
            <Box>
              <Stack
                direction="row"
                mr={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "end",
                  flexDirection: "column",
                }}
              >
                <p>
                  {" "}
                  İlaç Toplam:{" "}
                  {values.drugList.reduce((acc, drug) => {
                    return acc + drug.expense;
                  }, 0)}{" "}
                </p>
                <p>
                  {" "}
                  Eşya Toplam:{" "}
                  {values.itemList.reduce((acc, item) => {
                    return acc + item.expense;
                  }, 0)}{" "}
                </p>
                <p>
                  Toplam Satış Fiyatı:{" "}
                  {values.itemList.reduce((acc, item) => {
                    return acc + item.expense;
                  }, 0) +
                    values.drugList.reduce((acc, drug) => {
                      return acc + drug.expense;
                    }, 0)}
                </p>
              </Stack>
            </Box>
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                }}
              >
                Kaydet
              </Button>
            </Box>

            <Modal
              open={alternativeSuggest}
              onClose={handleAlternativeModalClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  pt: 2,
                  px: 4,
                  pb: 3,
                  width: 450,
                }}
              >
                <h2 id="parent-modal-title">Üründen yeterli stok yok!</h2>
                <p id="parent-modal-description">{alternativeModalText}</p>
              </Box>
            </Modal>

            <Modal
              open={patientDebt}
              onClose={handlePatientDebtModalClose}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  pt: 2,
                  px: 4,
                  pb: 3,
                  width: 450,
                }}
              >
                <Typography variant="h2" textAlign="center" id="parent-modal-title">Borçlu Hasta!</Typography>
                <Typography variant="p" textAlign="center" id="parent-modal-description">{patientDebtModalText}</Typography>
                <Button variant="outlined" onClick={handlePatientDebtModalClose}>Onayla</Button>
              </Box>
            </Modal>
          </form>
        )}
      </Formik>
    </Box>
    
  );
};
export default NewSale;

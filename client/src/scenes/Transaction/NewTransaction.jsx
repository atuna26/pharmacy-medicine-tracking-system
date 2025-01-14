import { EditOutlined, PaletteSharp } from "@mui/icons-material";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCompanies, setDrugs, setLogin, setProducts } from "state";
import Dropzone from "react-dropzone";
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { setPatient } from "state";
import { AlertContext } from "components/AlertContext";
import styled from "@emotion/styled";

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
}));

const transactionItemListSchema = yup.object().shape({
  item: yup.string(),
  company:yup.string(),
  phoneNumber:yup.string(),
  quantity: yup.number(),
  singlePrice: yup.number(),
  date:yup.date(),
});

const transactionDrugListSchema = yup.object().shape({
  drug: yup.string(),
  company:yup.string(),
  phoneNumber:yup.string(),
  quantity: yup.number(),
  singlePrice: yup.number(),
  date: yup.date(),
});

const transactionSchema = yup.object().shape({
  transactionItemList: yup.array().of(transactionItemListSchema),
  transactionDrugList: yup.array().of(transactionDrugListSchema),
  transactionType: yup.string().required("*zorunlu"),
  note: yup.string(),
});

const initialValuesPatient = {
  transactionItemList: [],
  transactionDrugList: [],
  note: "",
  transactionType: "",
};

const NewTransaction = () => {
  const { showAlert } = useContext(AlertContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const companies = useSelector((state)=>state.companies);
  const drugs = useSelector((state) => state.drugs);
  const products = useSelector((state) => state.products);

  /* GET DATAS */
  const getProductList = async () => {
    const response = await fetch(`http://localhost:3001/urun/tum-urunler`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setProducts(data));
  };
  const getDrugList = async () => {
    const response = await fetch(`http://localhost:3001/ilac/tum-ilaclar`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setDrugs(data));
  };
  const getCompanyList = async()=>{
    const response = await fetch("http://localhost:3001/firmalar/tum-firmalar",{
      method:"GET",
      headers:{Authorization:`Bearer ${token}`},  
    });
    const data = await response.json();
    dispatch(setCompanies(data))
  }

  const handleFormSubmit = async (values, onSubmitProps) => {
    const newTransactionResponse = await fetch(
      `http://localhost:3001/hareket/yeni-hareket`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, owner: user._id }),
      }
    );
    const NewTransaction = await newTransactionResponse.json();
    showAlert(`Hareket başarıyla oluşturuldu.`, "success");
    onSubmitProps.resetForm();
  };

  useEffect(() => {
    getProductList();
    getDrugList();
    getCompanyList();
    document.title = "EYS BETA 0.1.0 - Yeni Hareket";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* COMPANY CHANGE */
  const companyChange = (e,index,setFieldValue,type) =>{
    if(type==="drug"){
      const company = companies.find(
        (company) => company._id === document.getElementsByName(`transactionDrugList[${index}].company`)[0].value
      )
      if(company)
        setFieldValue(`transactionDrugList[${index}].phoneNumber`,company.phoneNumber)
    }else{
      const company = companies.find(
        (company) => company._id === document.getElementsByName(`transactionItemList[${index}].company`)[0].value
      )
      if(company)
        setFieldValue(`transactionItemList[${index}].phoneNumber`,company.phoneNumber)
    }
   
   
  }

  return (
    <Box flex={4}>
      <Box width="100%" height="50px">
        Yeni Hareket
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesPatient}
        validationSchema={transactionSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(8,minmax(0,1fr))"
            >
              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Hareket Tipi</InputLabel>
                <Select
                  label="Cinsiyet"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.transactionType}
                  name="transactionType"
                  error={
                    Boolean(touched.transactionType) &&
                    Boolean(errors.transactionType)
                  }
                  helperText={touched.transactionType && errors.transactionType}
                >
                  <MenuItem value="Alış">Alış</MenuItem>
                  <MenuItem value="İade">İade</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Not"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.note}
                name="note"
                error={Boolean(touched.note) && Boolean(errors.note)}
                helperText={touched.note && errors.note}
                sx={{ gridColumn: "span 4" }}
              />
              <FieldArray
                name="transactionDrugList"
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
                                width: "20%",
                              }}
                            >
                              Firma
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "20%",
                              }}
                            >
                              Telefon Numarası
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
                              Tekil Fiyat
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Tarih
                            </TableCell>
                          </TableRow>
                        </StyledTableHead>
                        <TableBody>
                          {values.transactionDrugList.map(
                            (transaction, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  <FormControl fullWidth>
                                    <InputLabel>İlaç {index + 1}</InputLabel>
                                    <Select
                                      label={`İlaç ${index + 1}`}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={
                                        values.transactionDrugList?.[index]
                                          ?.drug
                                      }
                                      name={`transactionDrugList[${index}].drug`}
                                      error={Boolean(
                                        touched.transactionDrugList?.[index]
                                          ?.drug &&
                                          errors.transactionDrugList?.[index]
                                            ?.drug
                                      )}
                                      helperText={
                                        touched.transactionDrugList?.[index]
                                          ?.drug &&
                                        errors.transactionDrugList?.[index]
                                          ?.drug
                                      }
                                    >
                                      {drugs.map((drug) => (
                                        <MenuItem
                                          key={drug._id}
                                          value={drug._id}
                                        >
                                          {drug.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                <FormControl fullWidth>
                                    <InputLabel>Firma {index + 1}</InputLabel>
                                    <Select
                                      label={`Firma ${index + 1}`}
                                      onBlur={handleBlur}
                                      onChange={(e)=>{
                                        handleChange(e);
                                        setTimeout(()=>{
                                          companyChange(e,index,setFieldValue,"drug")
                                        },0);
                                      }}
                                      value={
                                        values.transactionDrugList?.[index]
                                          ?.company
                                      }
                                      name={`transactionDrugList[${index}].company`}
                                      error={Boolean(
                                        touched.transactionDrugList?.[index]
                                          ?.company &&
                                          errors.transactionDrugList?.[index]
                                            ?.company
                                      )}
                                      helperText={
                                        touched.transactionDrugList?.[index]
                                          ?.company &&
                                        errors.transactionDrugList?.[index]
                                          ?.company
                                      }
                                    >
                                      {companies.map((company) => (
                                        <MenuItem
                                          key={company._id}
                                          value={company._id}
                                        >{company.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="right">
                                  <TextField
                                    label="Yetkili Numarası"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionDrugList?.[index]
                                        ?.phoneNumber
                                    }
                                    name={`transactionDrugList[${index}].phoneNumber`}
                                    type="text"
                                    error={Boolean(
                                      touched.transactionDrugList?.[index]
                                        ?.phoneNumber &&
                                        errors.transactionDrugList?.[index]
                                          ?.phoneNumber
                                    )}
                                    helperText={
                                      touched.transactionDrugList?.[index]
                                        ?.phoneNumber &&
                                      errors.transactionDrugList?.[index]
                                        ?.phoneNumber
                                    }
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <TextField
                                    label="Miktar"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionDrugList?.[index]
                                        ?.quantity
                                    }
                                    name={`transactionDrugList[${index}].quantity`}
                                    type="number"
                                    error={Boolean(
                                      touched.transactionDrugList?.[index]
                                        ?.quantity &&
                                        errors.transactionDrugList?.[index]
                                          ?.quantity
                                    )}
                                    helperText={
                                      touched.transactionDrugList?.[index]
                                        ?.quantity &&
                                      errors.transactionDrugList?.[index]
                                        ?.quantity
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    label="Tekil Fiyat"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionDrugList?.[index]
                                        ?.singlePrice
                                    }
                                    name={`transactionDrugList[${index}].singlePrice`}
                                    type="number"
                                    error={Boolean(
                                      touched.transactionDrugList?.[index]
                                        ?.singlePrice &&
                                        errors.transactionDrugList?.[index]
                                          ?.singlePrice
                                    )}
                                    helperText={
                                      touched.transactionDrugList?.[index]
                                        ?.singlePrice &&
                                      errors.transactionDrugList?.[index]
                                        ?.singlePrice
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    label="Tarih"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionDrugList?.[index]
                                        ?.date
                                    }
                                    name={`transactionDrugList[${index}].date`}
                                    type="date"
                                    error={Boolean(
                                      touched.transactionDrugList?.[index]
                                        ?.date &&
                                        errors.transactionDrugList?.[index]
                                          ?.date
                                    )}
                                    helperText={
                                      touched.transactionDrugList?.[index]
                                        ?.date &&
                                      errors.transactionDrugList?.[index]
                                        ?.date
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{ gridColumn: "span 1" }}
                      onClick={() =>
                        arrayHelpers.push({
                          drug: "",
                          company:"",
                          phoneNumber:"",
                          quantity: 0,
                          singlePrice: 0,
                          date: new Date(),
                        })
                      }
                    >
                      Yeni İlaç Ekle
                    </Button>
                  </>
                )}
              />
               <FieldArray
                name="transactionItemList"
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
                                width: "20%",
                              }}
                            >
                              Firma
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "20%",
                              }}
                            >
                              Telefon Numarası
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
                              Tekil Fiyat
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                                fontSize: 14,
                                fontWeight: 600,
                                width: "10%",
                              }}
                            >
                              Tarih
                            </TableCell>
                          </TableRow>
                        </StyledTableHead>
                        <TableBody>
                          {values.transactionItemList.map(
                            (transaction, index) => (
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  <FormControl fullWidth>
                                    <InputLabel>Ürün {index + 1}</InputLabel>
                                    <Select
                                      label={`Ürün ${index + 1}`}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      value={
                                        values.transactionItemList?.[index]
                                          ?.item
                                      }
                                      name={`transactionItemList[${index}].item`}
                                      error={Boolean(
                                        touched.transactionItemList?.[index]
                                          ?.item &&
                                          errors.transactionItemList?.[index]
                                            ?.item
                                      )}
                                      helperText={
                                        touched.transactionItemList?.[index]
                                          ?.item &&
                                        errors.transactionItemList?.[index]
                                          ?.item
                                      }
                                    >
                                      {products.map((product) => (
                                        <MenuItem
                                          key={product._id}
                                          value={product._id}
                                        >{product.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                <FormControl fullWidth>
                                    <InputLabel>Firma {index + 1}</InputLabel>
                                    <Select
                                      label={`Firma ${index + 1}`}
                                      onBlur={handleBlur}
                                      onChange={(e)=>{
                                        handleChange(e);
                                        setTimeout(()=>{
                                          companyChange(e,index,setFieldValue,"item")
                                        },0);
                                      }}
                                      value={
                                        values.transactionItemList?.[index]
                                          ?.company
                                      }
                                      name={`transactionItemList[${index}].company`}
                                      error={Boolean(
                                        touched.transactionItemList?.[index]
                                          ?.company &&
                                          errors.transactionItemList?.[index]
                                            ?.company
                                      )}
                                      helperText={
                                        touched.transactionItemList?.[index]
                                          ?.company &&
                                        errors.transactionItemList?.[index]
                                          ?.company
                                      }
                                    >
                                      {companies.map((company) => (
                                        <MenuItem
                                          key={company._id}
                                          value={company._id}
                                        >{company.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="right">
                                  <TextField
                                    label="Yetkili Numarası"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionItemList?.[index]
                                        ?.phoneNumber
                                    }
                                    name={`transactionItemList[${index}].phoneNumber`}
                                    type="text"
                                    error={Boolean(
                                      touched.transactionItemList?.[index]
                                        ?.phoneNumber &&
                                        errors.transactionItemList?.[index]
                                          ?.phoneNumber
                                    )}
                                    helperText={
                                      touched.transactionItemList?.[index]
                                        ?.phoneNumber &&
                                      errors.transactionItemList?.[index]
                                        ?.phoneNumber
                                    }
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <TextField
                                    label="Miktar"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionItemList?.[index]
                                        ?.quantity
                                    }
                                    name={`transactionItemList[${index}].quantity`}
                                    type="number"
                                    error={Boolean(
                                      touched.transactionItemList?.[index]
                                        ?.quantity &&
                                        errors.transactionItemList?.[index]
                                          ?.quantity
                                    )}
                                    helperText={
                                      touched.transactionItemList?.[index]
                                        ?.quantity &&
                                      errors.transactionItemList?.[index]
                                        ?.quantity
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    label="Tekil Fiyat"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionItemList?.[index]
                                        ?.singlePrice
                                    }
                                    name={`transactionItemList[${index}].singlePrice`}
                                    type="number"
                                    error={Boolean(
                                      touched.transactionItemList?.[index]
                                        ?.singlePrice &&
                                        errors.transactionItemList?.[index]
                                          ?.singlePrice
                                    )}
                                    helperText={
                                      touched.transactionItemList?.[index]
                                        ?.singlePrice &&
                                      errors.transactionItemList?.[index]
                                        ?.singlePrice
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    label="Tarih"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={
                                      values.transactionItemList?.[index]
                                        ?.date
                                    }
                                    name={`transactionItemList[${index}].date`}
                                    type="date"
                                    error={Boolean(
                                      touched.transactionItemList?.[index]
                                        ?.date &&
                                        errors.transactionItemList?.[index]
                                          ?.date
                                    )}
                                    helperText={
                                      touched.transactionItemList?.[index]
                                        ?.date &&
                                      errors.transactionItemList?.[index]
                                        ?.date
                                    }
                                    sx={{ gridColumn: "span 2" }}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Button
                      type="button"
                      variant="contained"
                      sx={{ gridColumn: "span 1" }}
                      onClick={() =>
                        arrayHelpers.push({
                          item: "",
                          company:"",
                          phoneNumber:"",
                          quantity: 0,
                          singlePrice: 0,
                          date: new Date(),
                        })
                      }
                    >
                      Yeni İlaç Ekle
                    </Button>
                  </>
                )}
              />
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
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default NewTransaction;

import { EditOutlined, PaletteSharp } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import { useContext, useState } from "react";
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
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { setPatient } from "state";
import { AlertContext } from "components/AlertContext";

const patientSchema = yup.object().shape({
  name: yup.string().required("*zorunlu"),
  code: yup.string().required("*zorunlu"),
  quantity: yup.number(),
  category: yup.string(),
  company: yup.string(),
  arrivalPrice: yup.string().required("*zorunlu"),
  salePrice: yup.string().required("*zorunlu"),
});


const initialValuesPatient = {
  name: "",
  code: "",
  quantity: "",
  category: "",
  company: "",
  arrivalPrice: "",
  salePrice: "",
};

const NewProduct = () => {
  const {showAlert} = useContext(AlertContext)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const handleFormSubmit = async (values, onSubmitProps) => {
    const newProductResponse = await fetch(
      `http://localhost:3001/urun/yeni-urun`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    const newProduct = await newProductResponse.json();
      showAlert(`${newProduct.name}, ${newProduct.code} kodu ile başarıyla oluşturuldu.`,"success")
    onSubmitProps.resetForm();
  };

  return (
    <Box flex={4}>
      <Box width="100%" height="50px">
        {" "}
        Yeni Ürün{" "}
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesPatient}
        validationSchema={patientSchema}
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
              gap="30px" mr={2}
              gridTemplateColumns="repeat(4,minmax(0,1fr))"
            >
              <TextField
                label="İsim"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={Boolean(touched.name) && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Kod"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.code}
                name="code"
                error={Boolean(touched.code) && Boolean(errors.code)}
                helperText={touched.code && errors.code}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Kategori</InputLabel>
                <Select
                  label="Cinsiyet"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.category}
                  name="category"
                  error={Boolean(touched.category) && Boolean(errors.category)}
                  helperText={touched.category && errors.category}
                >
                  <MenuItem value="Giyim">Giyim</MenuItem>
                  <MenuItem value="Bebek">Bebek</MenuItem>
                  <MenuItem value="Sağlık">Sağlık</MenuItem>
                  <MenuItem value="Oyuncak">Oyuncak</MenuItem>
                  <MenuItem value="Vitamin/Takviye">Vitamin/Takviye</MenuItem>
                  <MenuItem value="Diğer">Diğer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Firma"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.company}
                name="company"
                error={Boolean(touched.company) && Boolean(errors.company)}
                helperText={touched.company && errors.company}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Alış Fiyatı"
                type="Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.arrivalPrice}
                name="arrivalPrice"
                error={
                  Boolean(touched.arrivalPrice) &&
                  Boolean(errors.arrivalPrice)
                }
                helperText={touched.arrivalPrice && errors.arrivalPrice}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
              type="Number"
                label="Satış Fiyatı"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salePrice}
                name="salePrice"
                error={
                  Boolean(touched.salePrice) &&
                  Boolean(errors.salePrice)
                }
                helperText={touched.salePrice && errors.salePrice}
                sx={{ gridColumn: "span 2" }}
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
export default NewProduct;

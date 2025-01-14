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
  firstName: yup.string().required("*zorunlu"),
  lastName: yup.string().required("*zorunlu"),
  email: yup.string().email("invalid email").required("*zorunlu"),
  address: yup.string(),
  phoneNumber: yup.string(),
  identifyNumber: yup.string().required("*zorunlu"),
  sex: yup.string(),
  birthDate: yup.date().required("*zorunlu"),
  bloodType: yup.string(),
  alergies: yup.array().of(yup.string()),
  notes: yup.string(),
});


const initialValuesPatient = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  phoneNumber: "",
  identifyNumber: "",
  sex: "",
  birthDate: "",
  bloodType: "",
  alergies: [],
  notes: "",
};

const NewPatient = () => {
  const {showAlert} = useContext(AlertContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const handleFormSubmit = async (values, onSubmitProps) => {
    const newPatientResponse = await fetch(
      `http://localhost:3001/hasta-bilgi/yeni-hasta`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    const newPatient = await newPatientResponse.json();
    showAlert(`${newPatient.firstName} ${newPatient.lastName} adlı hasta başarıyla oluşturuldu.`, "success");
    onSubmitProps.resetForm();
  };

  return (
    <Box flex={4}>
      <Box width="100%" height="50px">
        {" "}
        Yeni Hasta{" "}
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
              gap="30px"
              gridTemplateColumns="repeat(4,minmax(0,1fr))"
            >
              <TextField
                label="İsim"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Soyisim"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Email"
                type="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
                <FormControl fullWidth  sx={{ gridColumn: "span 2" }}>
              <MuiTelInput
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                defaultCountry="TR"
                name="phoneNumber"
                error={
                  Boolean(touched.phoneNumber) && Boolean(errors.phoneNumber)
                }
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
              </FormControl>
              <TextField
                label="Adres"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={
                  Boolean(touched.address) &&
                  Boolean(errors.address)
                }
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Kimlik Numarası"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.identifyNumber}
                name="identifyNumber"
                error={
                  Boolean(touched.identifyNumber) &&
                  Boolean(errors.identifyNumber)
                }
                helperText={touched.identifyNumber && errors.identifyNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                type="date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.birthDate}
                name="birthDate"
                error={Boolean(touched.birthDate) && Boolean(errors.birthDate)}
                helperText={touched.birthDate && errors.birthDate}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Cinsiyet</InputLabel>
                <Select
                  label="Cinsiyet"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sex}
                  name="sex"
                  error={Boolean(touched.sex) && Boolean(errors.sex)}
                  helperText={touched.sex && errors.sex}
                >
                  <MenuItem value="Erkek">Erkek</MenuItem>
                  <MenuItem value="Kadın">Kadın</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Kan Grubu</InputLabel>
                <Select
                  label="Kan Grubu"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.bloodType}
                  name="bloodType"
                  error={Boolean(touched.bloodType) && Boolean(errors.bloodType)}
                  helperText={touched.bloodType && errors.bloodType}
                >
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="A+">A-</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="0+">0+</MenuItem>
                  <MenuItem value="0-">0-</MenuItem>


                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Alerjenler</InputLabel>
                <Select
                  label="Alerji"
                  multiple
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.alergies}
                  name="alergies"
                  error={Boolean(touched.alergies) && Boolean(errors.alergies)}
                  helperText={touched.alergies && errors.alergies}
                >
                  <MenuItem value="Fındık">Fındık</MenuItem>
                  <MenuItem value="Fıstık">Fıstık</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Notlar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.notes}
                name="notes"
                error={Boolean(touched.notes) && Boolean(errors.notes)}
                helperText={touched.notes && errors.notes}
                sx={{ gridColumn: "span 4" }}
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
export default NewPatient;

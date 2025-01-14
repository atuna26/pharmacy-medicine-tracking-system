import {
  Box,
  Button,
  Divider,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AlertContext } from "components/AlertContext";
import { Formik } from "formik";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "state";
import * as yup from "yup";


const settingSchema = yup.object().shape({
  phermacyName: yup.string().required("*zorunlu"),
  address: yup.string().required("*zorunlu"),
  debtDays: yup.number().required("*zorunlu"),
  creditDays: yup.number().required("*zorunlu"),
  leftDebtDays: yup.number().required("*zorunlu"),
  leftCreditDays: yup.number().required("*zorunlu"),
  messageBox: yup.string(),
});

function Settings() {
  const { showAlert } = useContext(AlertContext);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const settings = useSelector((state) => state.settings);

  /* GET SETTİNGS */
  const getSettings = async () => {
    const response = await fetch("http://localhost:3001/sistem/ayarlar", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setSettings(data));
  };

  /* FORM SUBMİT */
  const handleFormSubmit = async (values, onSubmitProps) => {
    const settingResponse = await fetch(
      "http://localhost:3001/sistem/ayarlar/duzenle",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    const newSetting = await settingResponse.json();
    showAlert(`Ayarlar başarıyla güncellendi`, "success");
  };

  useEffect(() => {
    getSettings();
    document.title = "EYS BETA 0.1.0 - Sistem Ayarları";
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box flex={4} p={2}>
      <Formik onSubmit={handleFormSubmit} 
      initialValues={{phermacyName:settings.phermacyName
        ,address:settings.address,
        creditDays:settings.creditDays,
        leftCreditDays:settings.leftCreditDays,
        debtDays:settings.debtDays,
        leftDebtDays:settings.leftDebtDays}}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
                width={850}
              display="grid"
              gap="10px"
              gridTemplateColumns="repeat(8,minmax(0,1fr))"
              justifyContent="center" alignItems="center"
            >
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Eczane Adı
              </Typography>
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phermacyName}
                name="phermacyName"
                error={
                  Boolean(touched.phermacyName) && Boolean(errors.phermacyName)
                }
                helperText={touched.phermacyName && errors.phermacyName}
                sx={{ gridColumn: "span 2" }}
              />
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Adres
              </Typography>
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={Boolean(touched.address) && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
             
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Borç Günü
              </Typography>
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.debtDays}
                name="debtDays"
                type="number"
                error={Boolean(touched.debtDays) && Boolean(errors.debtDays)}
                helperText={touched.debtDays && errors.debtDays}
                sx={{ gridColumn: "span 2" }}
              />
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Kaç borç günü kalınca mesaj atılsın
              </Typography>
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.leftDebtDays}
                name="leftDebtDays"
                type="number"
                error={
                  Boolean(touched.leftDebtDays) && Boolean(errors.leftDebtDays)
                }
                helperText={touched.leftDebtDays && errors.leftDebtDays}
                sx={{ gridColumn: "span 2" }}
              />
              
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Veresiye Günü
              </Typography>
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.creditDays}
                name="creditDays"
                type="number"
                error={
                  Boolean(touched.creditDays) && Boolean(errors.creditDays)
                }
                helperText={touched.creditDays && errors.creditDays}
                sx={{ gridColumn: "span 2" }}
              />
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Kaç veresiye günü kalınca mesaj atılsın
              </Typography>
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.leftCreditDays}
                name="leftCreditDays"
                type="number"
                error={
                  Boolean(touched.leftCreditDays) &&
                  Boolean(errors.leftCreditDays)
                }
                helperText={touched.leftCreditDays && errors.leftCreditDays}
                sx={{ gridColumn: "span 2" }}
              />
             
              <Typography textAlign="end" variant="p" sx={{ gridColumn: "span 2" }}>
                Tüm hastalara mesaj gönder
              </Typography>
              <TextField
              type="text"
                color="warning"
                multiline
                rows={4}
                maxRows={10}
                size="lg"
                variant="outlined" sx={{ gridColumn: "span 6" }}
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
}

export default Settings;

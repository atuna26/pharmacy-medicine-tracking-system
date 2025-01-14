import styled from "@emotion/styled";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { AlertContext } from "components/AlertContext";
import { Formik, Field } from "formik";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDrugs } from "state";
import * as yup from "yup";

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

const StyledStack = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
  alignItems: "center",
  gap: 1,
}));

const drugSchema = yup.object().shape({
  drugs: yup.array().of(
    yup.object().shape({
      _id: yup.string().required(),
      quantity: yup.number().min(0, "Miktar 0 veya daha büyük olmalıdır"),
      newQuantity: yup.number().min(0, "Miktar 0 veya daha büyük olmalıdır"),
    })
  ),
});

function CountChart() {
  const {showAlert} = useContext(AlertContext)
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const drugs = useSelector((state) => state.drugs);

  const getDrugList = async () => {
    const response = await fetch("http://localhost:3001/ilac/tum-ilaclar", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setDrugs(data));
  };

  const handleFormSubmit = async (values) => {
    console.log("button clicked")
    const updatedDrugs = values.drugs.map((drug) => ({
      _id: drug._id,
      quantity: drug.newQuantity || drug.quantity,
    }));

    await fetch("http://localhost:3001/ilac/miktar-guncelleme", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDrugs),
    });
    showAlert(`Stok durumu başarıyla güncellendi.`,"success")
    // İlaç listesini güncelle
    getDrugList();
  };

  useEffect(() => {
    getDrugList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box flex={4} p={2}>
      <Formik
        initialValues={{ drugs }}
        validationSchema={drugSchema}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }}>
                <StyledTableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      İlaç Adı
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Kod
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Mevcut Miktar
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Yeni Miktar
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {values.drugs.map((drug, index) => (
                    <StyledTableRow key={drug._id}>
                      <TableCell component="th" scope="row">
                        {drug.name}
                      </TableCell>
                      <TableCell align="right">{drug.code}</TableCell>
                      <TableCell align="center">{drug.quantity}</TableCell>
                      <TableCell align="center">
                        <Field
                          as={TextField}
                          name={`drugs[${index}].newQuantity`}
                          type="number"
                          value={drug.newQuantity}
                          onChange={(e) =>
                            setFieldValue(
                              `drugs[${index}].newQuantity`,
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <StyledStack>
              <Button variant="contained" className="noPrint" onClick={(e)=>handleFormSubmit(values)} type="submit">
                Kaydet
              </Button>
              <Button variant="contained" className="noPrint" color="error" onClick={() => window.print()} type="button">
                YAZDIR
              </Button>
            </StyledStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default CountChart;

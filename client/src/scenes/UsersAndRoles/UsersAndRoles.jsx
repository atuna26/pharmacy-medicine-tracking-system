import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setAccounts } from "state";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { AlertContext } from "components/AlertContext";
import { Field, Formik } from "formik";
import { CheckBox } from "@mui/icons-material";

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

const accountSchema = yup.object().shape({
  accounts: yup.array().of(
    yup.object().shape({
      _id: yup.string().required(),
      permission: yup.array(),
      newPermission: yup.array(),
    })
  ),
});

function UsersAndRoles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert } = useContext(AlertContext);
  const token = useSelector((state) => state.token);
  const accounts = useSelector((state) => state.accounts);
  const getAccountList = async () => {
    const response = await fetch(
      `http://localhost:3001/users/tum-kullanicilar`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setAccounts(data));
  };

  useEffect(() => {
    getAccountList();
    document.title = "EYS BETA 0.1.0 - Hasta Bilgileri";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = async (values) => {
    console.log("handle başladı");
    const updatedAccounts = values.accounts.map((account) => ({
      _id: account._id,
      permission: account.newPermission || account.permission,
    }));
    await fetch("http://localhost:3001/users/yetki-guncelleme", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAccounts),
    });
    showAlert("Roller başarıyla güncellendi", "success");
    getAccountList();
  };

  return (
    <Box flex={4} p={2}>
      <Box sx={{ display: "flex", justifyContent: "end" }} pb={2}>
        <Button
          variant="contained"
          color="success"
          component={NavLink}
          to="/hasta-bilgi/yeni-hasta"
        >
          Kullanıcılar ve Roller
        </Button>
      </Box>
      <Formik
        initialValues={{ accounts }}
        validationSchema={accountSchema}
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
                      İsim Soyisim
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Telefon Numarası
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Giriş Denemesi Hakkı
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Sayfa İzinleri
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                    >
                      Aksiyon
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {values.accounts.map((account, index) => (
                    <StyledTableRow key={account._id}>
                      <TableCell component="th" scope="row">
                        {account.firstName} {account.lastName}
                      </TableCell>
                      <TableCell align="right">{account.phoneNumber}</TableCell>
                      <TableCell align="right">
                        {account.loginAttempts}{" "}
                      </TableCell>
                      <TableCell align="right">
                        <FormControl sx={{maxWidth:"300px"}}>
                          <InputLabel>Yetkiler</InputLabel>
                          <Select
                            multiple // If you want multiple selections
                            name={`accounts[${index}].newPermission`}
                            value={account.newPermission || account.permission} // Ensure it's an array for multi-select
                            onChange={(e) => {
                              setFieldValue(
                                `accounts[${index}].newPermission`,
                                e.target.value // Directly assign the selected value(s)
                              );
                            }}
                            renderValue={(selected) => selected.join(", ")} // Show selected values as a comma-separated string
                          >
                            
                            <MenuItem key="Anasayfa" value="Anasayfa">
                              Anasayfa
                            </MenuItem>
                            <MenuItem key="Hasta Bilgi" value="Hasta Bilgi">
                              Hasta Bilgi
                            </MenuItem>
                            <MenuItem key="İlaç Bilgi" value="İlaç Bilgi">
                              İlaç Bilgi
                            </MenuItem>
                            <MenuItem key="Ürün Bilgi" value="Ürün Bilgi">
                              Ürün Bilgi
                            </MenuItem>
                            <MenuItem key="Borç Bilgi" value="Borç Bilgi">
                              Borç Bilgi
                            </MenuItem>
                            <MenuItem
                              key="Veresiye Bilgi"
                              value="Veresiye Bilgi"
                            >
                              Veresiye Bilgi
                            </MenuItem>
                            <MenuItem
                              key="Reçeteli Satış"
                              value="Reçeteli Satış"
                            >
                              Reçeteli Satış
                            </MenuItem>
                            <MenuItem
                              key="Reçetesiz Satış"
                              value="Reçetesiz Satış"
                            >
                              Reçetesiz Satış
                            </MenuItem>
                            <MenuItem key="Hareketler" value="Hareketler">
                              Hareketler
                            </MenuItem>
                            <MenuItem
                              key="Sayım Çizelgesi"
                              value="Sayım Çizelgesi"
                            >
                              Sayım Çizelgesi
                            </MenuItem>
                            <MenuItem
                              key="Kullanıcılar ve Roller"
                              value="Kullanıcılar ve Roller"
                            >
                              Kullanıcılar ve Roller
                            </MenuItem>
                            <MenuItem key="Ayarlar" value="Ayarlar">
                              Ayarlar
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          gap={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              navigate(
                                `/hasta-bilgi/${account._id}/gecmis-raporlar`
                              );
                              navigate(0);
                            }}
                          >
                            Detay
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              navigate(`/hasta-bilgi/${account._id}/duzenle`);
                              navigate(0);
                            }}
                          >
                            Sil
                          </Button>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" className="noPrint" type="submit">
              Kaydet
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
}

export default UsersAndRoles;

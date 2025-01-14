import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./scenes/Navbar/Navbar";
import { Box, Stack, ThemeProvider, CssBaseline, Alert } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Homepage from "./scenes/Homepage/Homepage";
import PatientData from "./scenes/PatientData/PatientData";
import PrescriptionSale from "./scenes/PrescriptionSale/PrescriptionSale";
import NoPrescriptionSale from "./scenes/NoPrescriptionSale/NoPrescriptionSale";
import DrugData from "./scenes/DrugData/DrugData";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import LoginPage from "scenes/LoginPage/LoginPage";
import NewPatient from "scenes/PatientData/NewPatient";
import CircleBar from "scenes/widgets/CircleBar";
import NewSale from "scenes/PrescriptionSale/NewSale";
import ProductData from "scenes/ProductData/ProductData";
import TransactionData from "scenes/Transaction/TransactionData";
import NewTransaction from "scenes/Transaction/NewTransaction";
import NewProduct from "scenes/ProductData/NewProduct";
import DebtData from "scenes/DebtCreditData/DebtData";
import CreditData from "scenes/DebtCreditData/CreditData";
import CountChart from "scenes/CountChart/CountChart";
import { AlertContext, AlertProvider } from "components/AlertContext";
import AlertComponent from "components/AlertComponent";
import Settings from "scenes/Settings/Settings";
import UsersAndRoles from "scenes/UsersAndRoles/UsersAndRoles";
import ErrorPage from "scenes/ErrorPage/ErrorPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state)=>state.user)
  const canAccess = (user,page) =>{
    console.log((user.permission).includes(page))
    return ((user.permission).includes(page))
  }

  return (
    <AlertProvider>
      <Box>
        <BrowserRouter>
          <Routes>
            <Route
              path="/giris"
              element={isAuth ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
              path="*"
              element={
                isAuth ? (
                  <Box>
                    <Navbar />
                    <Stack direction="row">
                      <Sidebar />
                      <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AlertComponent />
                        <Routes>
                          <Route path="/" element={canAccess(user,"Anasayfa") ? <Homepage /> : <ErrorPage/>} />
                          <Route
                            path="/hasta-bilgi"
                            element={canAccess(user,"Hasta Bilgi")? <PatientData /> : <ErrorPage/>}
                          />
                          <Route path="/ilac-bilgi" element={canAccess(user,"İlaç Bilgi")? <DrugData /> : <ErrorPage/>} />
                          <Route
                            path="/ilac-bilgi/:drugId/gecmis-raporlar"
                            element={canAccess(user,"Reçeteli Satış")? < PrescriptionSale kind="Drug" /> : <ErrorPage/>}
                          />
                          <Route path="/urun-bilgi" element={canAccess(user,"Ürün Bilgi")? <ProductData /> : <ErrorPage/>} />
                          <Route
                            path="/urun-bilgi/yeni-urun"
                            element={canAccess(user,"Ürün Bilgi")? <NewProduct /> : <ErrorPage/>}
                          />
                           <Route
                            path="/urun-bilgi/:productId/gecmis-raporlar"
                            element={canAccess(user,"Reçeteli Satış")? < PrescriptionSale kind="Product" /> : <ErrorPage/>}
                          />
                          <Route
                            path="/hasta-bilgi/yeni-hasta"
                            element={canAccess(user,"Hasta Bilgi")? <NewPatient /> : <ErrorPage/>}
                          />
                          <Route
                            path="/hasta-bilgi/:patientId/duzenle"
                            element={canAccess(user,"Hasta Bilgi")? <NewPatient /> : <ErrorPage/>}
                          />
                          <Route
                            path="/hasta-bilgi/:patientId/gecmis-raporlar"
                            element={canAccess(user,"Reçeteli Satış")? < PrescriptionSale kind="Patient" /> : <ErrorPage/>}
                          />
                          <Route path="/borc-bilgi" element={canAccess(user,"Borç Bilgi")? <DebtData /> : <ErrorPage/>} />
                          <Route
                            path="/veresiye-bilgi"
                            element={canAccess(user,"Veresiye Bilgi")? <CreditData /> : <ErrorPage/>}
                          />
                          <Route
                            path="/sayim-cizelgesi"
                            element={canAccess(user,"Sayım Çizelgesi")? <CountChart /> : <ErrorPage/>}
                          />
                          <Route
                            path="/receteli-satis"
                            element={canAccess(user,"Reçeteli Satış")? <PrescriptionSale kind="All"/> : <ErrorPage/>}
                          />
                          <Route
                            path="/receteli-satis/yeni-satis"
                            element={canAccess(user,"Reçeteli Satış")? <NewSale /> : <ErrorPage/>}
                          />
                          <Route
                            path="/recetesiz-satis"
                            element={canAccess(user,"Reçetesiz Satış") ? <NoPrescriptionSale /> : <ErrorPage/>}
                          />
                          <Route
                            path="/recetesiz-satis/yeni-satis"
                            element={canAccess(user,"Reçetesiz Satş")? <NoPrescriptionSale />: <ErrorPage/>}
                          />
                          <Route
                            path="/hareket"
                            element={canAccess(user,"Hareketler")? <TransactionData /> : <ErrorPage/>}
                          />
                          <Route
                            path="/hareket/yeni-hareket"
                            element={canAccess(user,"Hareketler")? <NewTransaction /> : <ErrorPage/>}
                          />
                          <Route path="/ayarlar" element={canAccess(user,"Ayarlar")? <Settings /> : <ErrorPage/>} />
                          <Route path="/kullanicilar-ve-roller" element={canAccess(user,"Kullanıcılar ve Roller")? <UsersAndRoles />: <ErrorPage/>} />
                        </Routes>
                      </ThemeProvider>
                    </Stack>
                  </Box>
                ) : (
                  <Navigate to="giris" />
                )
              }
            />
          </Routes>
          <CircleBar />
        </BrowserRouter>
        <AlertComponent />
      </Box>
    </AlertProvider>
  );
}

export default App;

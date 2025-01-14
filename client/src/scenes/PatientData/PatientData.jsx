import {
  Box,
  Button,
  Card,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  
} from "@mui/material";
import { useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { setPatient } from "state";
import { useDispatch, useSelector } from "react-redux";

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


function PatientData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const patients = useSelector((state) => state.patients);
  const currentDate = new Date();
  const getPatientList = async () => {
    const response = await fetch(`http://localhost:3001/hasta-bilgi/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPatient(data));
  };

  useEffect(() => {
    getPatientList();
    document.title = "EYS BETA 0.1.0 - Hasta Bilgileri";
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box flex={4} p={2}>
      <Box sx={{ display: "flex", justifyContent: "end" }} pb={2}>
        <Button
          variant="contained"
          color="success" component={NavLink} to="/hasta-bilgi/yeni-hasta"
        >
          {" "}
          Yeni Hasta
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} >
          <StyledTableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                Hasta Adı
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Yaş
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                İletişim
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Devam Edilen İlaçlar
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
            {patients.map((patient) => (
              <StyledTableRow>
                <TableCell component="th" scope="row">
                 {patient.firstName} {patient.lastName}
                </TableCell>
                <TableCell align="right">{currentDate.getMonth() - new Date(patient.birthDate).getMonth() < 0 ? (currentDate.getFullYear()-new Date(patient.birthDate).getFullYear()).toLocaleString()-1 : (currentDate.getFullYear()-new Date(patient.birthDate).getFullYear()).toLocaleString()} </TableCell>
                <TableCell align="right">{patient.email}</TableCell>
                <TableCell align="right">OCEMEL3000, FUCİ2000 (...)</TableCell>
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
                        navigate(`/hasta-bilgi/${patient._id}/gecmis-raporlar`);
                        navigate(0);
                      }}
                    >
                      Geçmiş Raporlar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(`/hasta-bilgi/${patient._id}/duzenle`);
                        navigate(0);
                      }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(`/hasta-bilgi/${patient._id}/detay`);
                        navigate(0);
                      }}
                    >
                      Detay
                    </Button>
                  </Stack>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Modal
        open={isPatientModelOpen}
        onClose={handleFalseIsPatientModelOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledCard sx={{ minWidth: 275 }}>
          <Stack direction="column" gap={2}>
            <Typography variant='h5' pt={2} textAlign="center" color="text.primary" gutterBottom>
              Yeni Hasta
            </Typography>
            <Divider />
            <form action="" method="post">
              <Grid container p={2} gap={2} >
                <Stack direction="row" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} gap={2}>
                  <Grid xs={5}>
                    <TextField id="outlined-basic" label="İsim" variant="outlined" />
                  </Grid>
                  <Grid xs={5}>
                    <TextField id="outlined-basic" label="Soy isim" variant="outlined" />
                  </Grid>
                  <Grid xs={2}>
                    <TextField type='number' id="outlined-basic" label="Yaş" variant="outlined" />
                  </Grid>
                </Stack>
                <Stack direction="row" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} gap={2}>
                  <Grid xs={6}>
                    <TextField id="outlined-basic" label="TC" type='number' variant="outlined" />
                  </Grid>
                  <Grid xs={6}>
                    <MuiTelInput value={phoneNo} onChange={handlePhoneChange} />
                  </Grid>
                </Stack>
                 
              </Grid>
            </form>
          </Stack>
          <CardActions sx={{display:"flex",justifyContent:"end",alignItems:"center"}}>
            <Button variant="contained">Kaydet</Button>
          </CardActions>
        </StyledCard>
      </Modal> */}
    </Box>
  );
}

export default PatientData;

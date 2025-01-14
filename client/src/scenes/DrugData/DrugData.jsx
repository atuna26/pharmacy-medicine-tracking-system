import {
  Avatar,
  Box,
  Button,
  Icon,
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDrugs, updateDrugQuantity,updateDrugDebt } from "../../state";
import { useNavigate } from "react-router-dom";

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

function DrugData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const drugs = useSelector((state) => state.drugs);

  
  const handleIncreaseQuantity = async (id) => {
    const response = await fetch(
      `http://localhost:3001/ilac/miktar-arttir/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedQuantity = await response.json();
    dispatch(updateDrugQuantity({ id, quantity: updatedQuantity }));
  };
  const handleDecreaseQuantity = async (id) => {
    const response = await fetch(
      `http://localhost:3001/ilac/miktar-azalt/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedQuantity = await response.json();
    dispatch(updateDrugQuantity({ id, quantity: updatedQuantity }));
  };
  const handleIncreaseDebt = async (id) => {
    const response = await fetch(
      `http://localhost:3001/ilac/borc-arttir/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedDebt = await response.json();
    dispatch(updateDrugDebt({ id, debt: updatedDebt }));
  };
  const handleDecreaseDebt = async (id) => {
    const response = await fetch(
      `http://localhost:3001/ilac/borc-azalt/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedDebt = await response.json();
    dispatch(updateDrugDebt({ id, debt: updatedDebt }));
  };




  const getDrugList = async () => {
    const response = await fetch("http://localhost:3001/ilac/tum-ilaclar", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setDrugs(data));
  };

  useEffect(() => {
    getDrugList();
    document.title = "EYS BETA 0.1.0 - İlaç Bilgileri";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box flex={4} p={2}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} >
          <StyledTableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                İlaç Adı
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Kod
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Miktar
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Borç
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Firma
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
            {drugs.map((drug) => (
              <StyledTableRow key={drug._id}>
                <TableCell component="th" scope="row">
                  {drug.name}
                </TableCell>
                <TableCell align="right">{drug.code}</TableCell>
                <TableCell align="center">
                  <StyledStack>
                    {drug.quantity}
                    {/*  <Icon>
                      <ArrowUpwardIcon  onClick={() => handleIncreaseQuantity(drug._id)} 
                        color="success"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      />
                    </Icon>
                    <Icon>
                      <ArrowDownwardIcon color="error"  sx={{ "&:hover": { cursor: "pointer" } }}  onClick={() => handleDecreaseQuantity(drug._id)} />
                    </Icon>*/}
                  </StyledStack>
                </TableCell>
                <TableCell align="center">
                  <StyledStack>
                    {drug.debt}
                    {/* 
                    <Icon >
                      <ArrowUpwardIcon color="success"   sx={{ "&:hover": { cursor: "pointer" } }}  onClick={() => handleIncreaseDebt(drug._id)}/>
                    </Icon>
                    <Icon>
                      <ArrowDownwardIcon color="error"   sx={{ "&:hover": { cursor: "pointer" } }}  onClick={() => handleDecreaseDebt(drug._id)} />
                    </Icon>*/}
                  </StyledStack>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  <Avatar>{drug.company}</Avatar>
                  {drug.company}
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
                    <Button variant="contained" onClick={() => {
                        navigate(`/ilac-bilgi/${drug._id}/gecmis-raporlar`);
                        navigate(0);
                      }}>Geçmiş Raporlar</Button>
                    <Button variant="contained">Detay</Button>
                  </Stack>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DrugData;

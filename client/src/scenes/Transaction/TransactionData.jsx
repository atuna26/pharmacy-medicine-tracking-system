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
  Typography,
  TableRow,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setTransactions } from "state";

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

function TransactionData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const transactions = useSelector((state) => state.transactions);

  const getTransactionList = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/hareket/tum-hareketler",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        dispatch(setTransactions(data));
        console.log("ok");
      } else {
        console.error("Fetch error:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getTransactionList();
    document.title = "EYS BETA 0.1.0 - Tüm Hareketler";
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box flex={4} p={2}>
      <Box sx={{ display: "flex", justifyContent: "end" }} pb={2}>
        <Button
          variant="contained"
          color="success"
          component={NavLink}
          to="/hareket/yeni-hareket"
        >
          Yeni Hareket
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} >
          <StyledTableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                Hareket Tipi
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Hareket Sahibi
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                İçerik
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
              >
                Toplam Tutar
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
            {transactions.map((transaction) => (
              <StyledTableRow key={transaction._id}>
                <TableCell component="th" scope="row">
                  {transaction.transactionType}
                </TableCell>
                <TableCell align="right">{transaction.owner.firstName} {transaction.owner.lastName}</TableCell>
                <TableCell align="center">
                  {transaction.transactionItemList.length > 0 &&
                    transaction.transactionItemList.map((items) => (
                      <span key={items.item._id}>{items.item.name} ({items.quantity}), </span>
                    ))}
                  {transaction.transactionDrugList.length > 0 &&
                    transaction.transactionDrugList.map((drugs) => (
                      <span key={drugs.drug._id}>{drugs.drug.name}({drugs.quantity}), </span>
                    ))}
                </TableCell>
                <TableCell align="center">{transaction.total}₺</TableCell>
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
                    <Button variant="contained">Düzenle</Button>
                    <Button variant="contained">Sil</Button>
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

export default TransactionData;

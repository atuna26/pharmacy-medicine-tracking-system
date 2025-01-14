import { Box, Button, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { setPrescription } from 'state'

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark

}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

function PrescriptionSale({kind}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state)=>state.token);
  const prescriptions = useSelector((state)=>state.prescriptions)
  const {patientId,drugId,productId} = useParams();
  const getSaleList = async () => {
    if(kind==="All"){
      
      const response = await fetch(`http://localhost:3001/satis/receteli-satis`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPrescription(data));
    }
    else if(kind==="Patient"){
      const response = await fetch(`http://localhost:3001/satis/hasta/${patientId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPrescription(data));
    }
    else if(kind==="Drug"){
      const response = await fetch(`http://localhost:3001/satis/ilac/${drugId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPrescription(data));
    }
    else if(kind==="Product"){
      const response = await fetch(`http://localhost:3001/satis/urun/${productId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPrescription(data));
    }
    
  };

  useEffect(()=>{
    getSaleList();
    document.title = "EYS BETA 0.1.0 - Reçeteli Satış"

  },[])// eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <Box flex={4} p={2}>
      <Box sx={{ display: "flex", justifyContent: "end" }} pb={2}>
        <Button variant="contained" color='success' component={NavLink} to="/receteli-satis/yeni-satis" >Yeni Satış</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} >
          <StyledTableHead>
            <TableRow>
              <TableCell  sx={{ color: "white", fontSize: 14,fontWeight:600 }}>Satış No</TableCell>
              <TableCell align="right"  sx={{ color: "white", fontSize: 14,fontWeight:600 }}>Rapor No</TableCell>
              <TableCell align="right"  sx={{ color: "white", fontSize: 14,fontWeight:600 }}>Hasta Adı</TableCell>
              <TableCell align="right"  sx={{ color: "white", fontSize: 14,fontWeight:600 }}>Tarih</TableCell>
              <TableCell align="right"  sx={{ color: "white", fontSize: 14,fontWeight:600 }}>Toplam Tutar</TableCell>
              <TableCell align="center"  sx={{ color: "white", fontSize: 14,fontWeight:600 }}>Aksiyon</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {prescriptions.map((sale)=>(
              <StyledTableRow >
              <TableCell component="th" scope="row">
                {sale._id}
              </TableCell>
              <TableCell align="right">{sale._id}</TableCell>
              <TableCell align="right">{sale.customerName.firstName} {sale.customerName.lastName}</TableCell>
              <TableCell align="right">{new Date(sale.date).toLocaleDateString()}</TableCell>
              <TableCell align="center">{sale.total}₺</TableCell>
              <TableCell align="right">
                <Stack direction="row" gap={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button variant="contained">Detay</Button><Button variant="contained">İndir</Button>
                </Stack>
              </TableCell>
            </StyledTableRow>
            ))}
            
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PrescriptionSale

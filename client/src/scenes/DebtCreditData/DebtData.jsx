import { Box, Button, Paper, Stack, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AlertContext } from 'components/AlertContext';
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPrescription } from 'state';


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
  

function DebtData() {
    const dispatch = useDispatch();
    const {showAlert} = useContext(AlertContext)
    const token = useSelector((state)=>state.token);
    const prescriptions = useSelector((state)=>state.prescriptions)

    const getDebtList = async () =>{
        const response = await fetch("http://localhost:3001/satis/borc-bilgi",{
            method:"GET",
            headers:{Authorization: `Bearer ${token}`}
        })
        const data = await response.json();
        dispatch(setPrescription(data))
    }
    useEffect(()=>{
        getDebtList();
        document.title = "EYS BETA 0.1.0 - Borç Bilgileri"
    },[]) //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Box flex={4} p={2}>
        <TableContainer component={Paper}>
            <Table sx={{minWidth:700}}>
                <StyledTableHead>
                    <TableRow>
                        <TableCell sx={{color:"white",fontSize:14,fontWeight:600}}>
                            Hasta Adı
                        </TableCell>
                        <TableCell align='right' sx={{color:"white",fontSize:14,fontWeight:600}}>
                            İlaç Adı
                        </TableCell>
                        <TableCell align='center' sx={{color:"white",fontSize:14,fontWeight:600}}>
                            Hasta Telefon Numarası
                        </TableCell>
                        <TableCell align='center' sx={{color:"white",fontSize:14,fontWeight:600}}>
                            Kalan Gün
                        </TableCell>
                        <TableCell align='right' sx={{color:"white",fontSize:14,fontWeight:600}}>
                            Aksiyon
                        </TableCell>
                    </TableRow>
                </StyledTableHead>
                <TableBody>
                    {prescriptions.map((prescription)=>(
                        <StyledTableRow key={prescription._id}>
                            <TableCell component="th" scope='row'>
                                {prescription.customerName.firstName} {prescription.customerName.lastName}
                            </TableCell>
                            <TableCell align='right'>
                            {prescription.drugList.filter((drug) => drug.isDebt === true && drug.isDebtClosed === false).map((filteredDrug) => (
                                <span key={filteredDrug._id}>{filteredDrug.drugName.name}</span>
                                ))}
                            </TableCell>
                            <TableCell align='center'>
                                {prescription.customerName.phoneNumber}
                            </TableCell> 

                            <TableCell align='center'>
                                {Math.floor((new Date(prescription.drugList[0].debtFinishDate) - new Date()) / (1000 * 60 * 60 * 24))}
                            </TableCell> 
                            <TableCell align='right'>
                                <Button variant="contained">Rapor Detayı</Button>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
  )
}

export default DebtData
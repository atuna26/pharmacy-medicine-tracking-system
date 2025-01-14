import { Box, Typography } from '@mui/material'
import React from 'react'

function ErrorPage() {
  return (
    <Box flex={4} p={2} sx={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
        <Typography variant='h1' sx={{fontSize:"20rem",fontWeight:800,color:"#99EEFD",textAlign:"center"}}>404 :(</Typography>
        <Typography variant='p' sx={{color:"#006999",textAlign:"center"}}>Gitmeye çalıştığınız sayfa bulunamadı.<br/> Bir yanlışlık olduğunu düşünüyorsanız yöneticiniz ile iteşime geçiniz.</Typography>
    </Box>
  )
}

export default ErrorPage
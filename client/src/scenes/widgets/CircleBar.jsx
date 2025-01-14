import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import React from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { NavLink } from 'react-router-dom';
function CircleBar() {
  return (
    <Box className="noPrint" position="sticky" sx={{ bottom: "0",}} mt={10} >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        
          <SpeedDialAction component={NavLink} to="/hasta-bilgi/yeni-hasta"
            icon={<PersonAddAlt1Icon/>} tooltipTitle="Yeni Hasta"
          />
            <SpeedDialAction component={NavLink} to="/receteli-satis/yeni-satis"
            icon={<NoteAddIcon/>} tooltipTitle="Yeni Reçete"
          />
      </SpeedDial>
    </Box>
  )
}

export default CircleBar;

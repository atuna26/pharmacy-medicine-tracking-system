import React, { useState } from 'react'
import { AppBar, Autocomplete, Avatar, Badge, Box, InputBase, ListItemButton, ListItemIcon, Menu, MenuItem, styled, Switch, TextField, Toolbar, Typography, useTheme } from '@mui/material'
import MedicationIcon from '@mui/icons-material/Medication';
import { ModeNight, Notifications } from '@mui/icons-material';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useSelector,useDispatch } from 'react-redux';
import { setLogin, setLogout } from 'state';
import { useNavigate } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})
const Search = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: 20,
  width: "15%",
}))

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  }
}))
const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "20px",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  }
}))

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user  = useSelector((state)=> state.user)
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const fullName = `${user.firstName} ${user.lastName}`
  const logout = () => {
    dispatch(
      setLogin({
        user:null,
        token:null,
      })
    )
  }

  return (
    <AppBar className='noPrint' position='sticky' sx={{ borderRadius: "0 0 0.8rem 0" }}>
      <StyledToolbar>
        <StyledToolbar sx={{ gap: "5px", margin: "0", }}>
          <MedicationIcon fontSize='large' />
          <Typography variant='h5' sx={{ display: { xs: "none", sm: "block" } }}>
            EYS BETA 0.1.0
          </Typography>
        </StyledToolbar>
        <Search> <InputBase placeholder='Seach' /> </Search>
        <Icons>
          <LightModeIcon sx={{ color: "white" }} />
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
          <Avatar onClick={e => setOpen(true)} />
          {fullName}

        </Icons>
        <UserBox>
          <Avatar onClick={e => setOpen(true)} />
          {fullName}
        </UserBox>
      </StyledToolbar>
      <Menu open={open} onClose={(e) => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "left" }}>
        <MenuItem>Profil</MenuItem>
        <MenuItem sx={{ display: { xs: "block", sm: "none" } }}>Bildirimler (4)</MenuItem>
        <MenuItem onClick={(e)=>logout()}>Çıkış</MenuItem>
      </Menu>

    </AppBar >
  )
}

export default Navbar

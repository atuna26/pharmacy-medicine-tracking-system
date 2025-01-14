import {
  Badge,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Switch,
} from "@mui/material";
import React from "react";
import { Home } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import { NavLink, NavNavLink } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const canAccess = (user, page) => {
    console.log(user.permission.includes(page));
    return user.permission.includes(page);
  };

  return (
    <Box
      className="noPrint"
      flex={1}
      p={2}
      sx={{ display: { xs: "none", sm: "block" } }}
    >
      <Box position="fixed">
        <List>
          {canAccess(user, "Anasayfa") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/">
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Anasayfa" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
        </List>
        <Divider />
        <List>
          {canAccess(user, "Hasta Bilgi") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/hasta-bilgi">
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Hasta Bilgi" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "İlaç Bilgi") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/ilac-bilgi">
                <ListItemIcon>
                  <MedicationLiquidIcon />
                </ListItemIcon>
                <ListItemText primary="İlaç Bilgi" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Ürün Bilgi") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/urun-bilgi">
                <ListItemIcon>
                  <CategoryIcon />
                </ListItemIcon>
                <ListItemText primary="Ürün Bilgi" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Borç Bilgi") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/borc-bilgi">
                <ListItemIcon>
                  <ContactEmergencyIcon />
                </ListItemIcon>
                <ListItemText primary="Borç Bilgi" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Veresiye Bilgi") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/veresiye-bilgi">
                <ListItemIcon>
                  <CurrencyExchangeIcon />
                </ListItemIcon>
                <ListItemText primary="Veresiye Bilgi" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
        </List>
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Satış
            </ListSubheader>
          }
        >
          {canAccess(user, "Reçeteli Satış") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/receteli-satis">
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary="Reçeteli Satış" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Reçetesiz Satış") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/recetesiz-satis">
                <ListItemIcon>
                  <Badge badgeContent={"X"}>
                    <ArticleIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Reçetesiz Satış" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          <Divider />
          {canAccess(user, "Hareketler") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/hareket">
                <ListItemIcon>
                  <ImportExportIcon />
                </ListItemIcon>
                <ListItemText primary="Hareketler" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Sayım Çizelgesi") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/sayim-cizelgesi">
                <ListItemIcon>
                  <DocumentScannerIcon />
                </ListItemIcon>
                <ListItemText primary="Sayım Çizelgesi" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Kullanıcılar ve Roller") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/kullanicilar-ve-roller">
                <ListItemIcon>
                  <PeopleAltIcon />
                </ListItemIcon>
                <ListItemText primary="Kullanıcılar ve Roller" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
          {canAccess(user, "Ayarlar") ? (
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/ayarlar">
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Ayarlar" />
              </ListItemButton>
            </ListItem>
          ) : (
            <></>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;

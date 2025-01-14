import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Table,
  TableContainer,
  Typography,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { Work } from "@mui/icons-material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "scenes/Navbar/Navbar";
import Sidebar from "components/Sidebar"

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];

const xLabels = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
];

function Homepage() {
  useEffect(() => {
    document.title = "EYS BETA 0.1.0 - Anasayfa";
  }, []);

  return (
      <Box flex={4} p={2}>
        <Grid
          container
          rowSpacing={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          columnSpacing={{ xs: 6 }}
        >
          <Grid xs={12} md={6}>
            <BarChart
              width={600}
              height={300}
              series={[
                {
                  data: pData,
                  label: "pv",
                },
                {
                  data: uData,
                  label: "uv",
                },
              ]}
              xAxis={[
                {
                  data: xLabels,
                  scaleType: "band",
                },
              ]}
              yAxis={[{ max: 10000 }]}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <BarChart
              width={600}
              height={300}
              series={[
                {
                  data: pData,
                  label: "pv",
                },
                {
                  data: uData,
                  label: "uv",
                },
              ]}
              xAxis={[
                {
                  data: xLabels,
                  scaleType: "band",
                },
              ]}
              yAxis={[{ max: 10000 }]}
            />
          </Grid>
          <Grid xs={12} md={6} pt={4}>
            <Stack>
              <Typography variant="h4" textAlign="center">
                Stoğu Tükenen Ürünler
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>İlaç Adı</TableCell>
                      <TableCell align="right">Kod</TableCell>
                      <TableCell align="right">Firma</TableCell>
                      <TableCell align="right">Alış</TableCell>
                      <TableCell align="right">Satış</TableCell>
                      <TableCell align="right">Haftalık Satış (Ort)</TableCell>
                      <TableCell align="right">Tel No</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
          <Grid xs={12} md={6} pt={4} pl={2}>
            <Stack>
              <Typography variant="h4" textAlign="center">
                Stoğu Tükenmek Üzere Olan Ürünler
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>İlaç Adı</TableCell>
                      <TableCell align="right">Kod</TableCell>
                      <TableCell align="right">Firma</TableCell>
                      <TableCell align="right">Alış</TableCell>
                      <TableCell align="right">Satış</TableCell>
                      <TableCell align="right">Haftalık Satış (Ort)</TableCell>
                      <TableCell align="right">Tel No</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Avatar>
                          <Work />
                        </Avatar>
                      </TableCell>
                      <TableCell>Melatonin</TableCell>
                      <TableCell>OCEMEL3000</TableCell>
                      <TableCell align="right">Ocean</TableCell>
                      <TableCell align="right">50TL</TableCell>
                      <TableCell align="right">200TL</TableCell>
                      <TableCell align="center">13</TableCell>
                      <TableCell align="right">+90 212 544 54</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
        </Grid>
      </Box>
  );
}

export default Homepage;

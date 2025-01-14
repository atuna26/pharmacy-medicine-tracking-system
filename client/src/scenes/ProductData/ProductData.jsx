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
  import { useEffect} from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { NavLink, useNavigate } from "react-router-dom";
  import {updateProductQuantity, setProducts } from "../../state";
  
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
  
  function ProductData() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const products = useSelector((state) => state.products);
  
    
    const handleIncreaseQuantity = async (id) => {
      const response = await fetch(
        `http://localhost:3001/urun/miktar-arttir/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedQuantity = await response.json();
      dispatch(updateProductQuantity({ id, quantity: updatedQuantity }));
    };
    const handleDecreaseQuantity = async (id) => {
      const response = await fetch(
        `http://localhost:3001/urun/miktar-azalt/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedQuantity = await response.json();
      dispatch(updateProductQuantity({ id, quantity: updatedQuantity }));
    };
  
  
  
    const getProductList = async () => {
      const response = await fetch("http://localhost:3001/urun/tum-urunler", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setProducts(data));
    };
  
    useEffect(() => {
      getProductList();
      document.title = "EYS BETA 0.1.0 - Ürün Bilgileri";
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    return (
      <Box flex={4} p={2}>
        <Box sx={{ display: "flex", justifyContent: "end" }} pb={2}>
        <Button variant="contained" color='success' component={NavLink} to="/urun-bilgi/yeni-urun" >Yeni Ürün</Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} >
            <StyledTableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                  Ürün Adı
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
                  align="center"
                  sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                >
                  Alış Fiyatı
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                >
                  Satış Fiyatı
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontSize: 14, fontWeight: 600 }}
                >
                  Kategori
                </TableCell>
                <TableCell
                  align="right"
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
              {products.map((product) => (
                <StyledTableRow key={product._id}>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="right">{product.code}</TableCell>
                  <TableCell align="right">
                    <StyledStack>
                      {product.quantity}
                      <Icon>
                        <ArrowUpwardIcon  onClick={() => handleIncreaseQuantity(product._id)} 
                          color="success"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        />
                      </Icon>
                      <Icon>
                        <ArrowDownwardIcon color="error"  sx={{ "&:hover": { cursor: "pointer" } }}  onClick={() => handleDecreaseQuantity(product._id)} />
                      </Icon>
                    </StyledStack>
                  </TableCell>
                  <TableCell align="right">{product.arrivalPrice}</TableCell>
                  <TableCell align="right">{product.salePrice}</TableCell>
                  <TableCell align="right">{product.category}</TableCell>
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
                    <Avatar>{product.company}</Avatar>
                    {product.company}
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
                        navigate(`/urun-bilgi/${product._id}/gecmis-raporlar`);
                        navigate(0);
                      }}>Geçmiş Raporlar</Button>
                      <Button variant="contained">Düzenle</Button>
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
  
  export default ProductData;
  
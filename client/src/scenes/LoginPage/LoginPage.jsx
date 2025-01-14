import { Box, Typography, useMediaQuery, useTheme, } from "@mui/material";
import Form from "./Form"

function LoginPage() {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography variant="h5" sx={{ display: { xs: "none", sm: "block" } }}>
          EYS BETA 0.1.0
        </Typography>
      </Box>
      <Box width={isNonMobileScreens ? "50%" : "93%"} p="2rem" m="2rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt}>
        <Typography fontWeight="500" variant="h5" sx={{mb:"1.5rem"}}>
          EYS BETA 0.1.0 Yetkili Giriş Ekranı
        </Typography>
        <Form/>
      </Box>
    </Box>
  );
}

export default LoginPage;
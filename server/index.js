import express from "express";
import bodyParser from "body-parser"
import mongoose, { Mongoose } from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import drugRoutes from "./routes/drugs.js"
import patientRoutes from "./routes/patients.js"
import prescriptionRoutes from "./routes/prescriptions.js"
import saleRoutes from "./routes/sales.js"
import productRoutes from "./routes/products.js"
import transactionRoutes from "./routes/transactions.js"
import { register } from "./controllers/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/ilac",drugRoutes);
app.use("/recete",prescriptionRoutes)
app.use("/hasta-bilgi",patientRoutes);
app.use("/satis",saleRoutes)
app.use("/urun",productRoutes);
app.use("/hareket",transactionRoutes)

/* MONGOOSE */
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port ${PORT}`))
}).catch(err=>console.error(`${err} did not connect`))
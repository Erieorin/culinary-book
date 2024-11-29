const express = require("express");
const cors = require("cors"); // Cross-Origin Resource Sharing
const bodyParser = require("body-parser"); // для парсинга JSON запросов.
const dotenv = require("dotenv"); // для чтения .env 
const connectDB = require("./config/db");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const cartRoutes = require("./routes/cartRoutes");
const multer = require("multer"); // для изображений
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // static открывает доступ к папке серверу

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/api/upload", upload.array("images"), (req, res) => {
  const filePaths = req.files.map((file) => `/uploads/${file.filename}`); // перебирает файлы
  res.json({ filePaths });
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plan", mealPlanRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

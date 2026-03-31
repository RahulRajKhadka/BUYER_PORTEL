import express from "express";
import authRoutes from "./routes/auth.routes"
import propertyRoute from "./routes/property.routes"
import favouriteRoute from "./routes/favourites.routes"
import cors from "cors"
import dotenv from 'dotenv';

dotenv.config();




const app = express();


app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/properties", propertyRoute);
app.use("/api/favourites", favouriteRoute);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});








app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
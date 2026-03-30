import express from "express";
import authRoutes from "./routes/auth.routes"
import propertyRoute from "./routes/property.routes"
import favouriteRoute from "./routes/favourites.routes"

const app = express();

app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/properties", propertyRoute);
app.use("/api/favourites", favouriteRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
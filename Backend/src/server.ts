import app from "./app";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
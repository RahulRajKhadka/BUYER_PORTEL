import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Sample User schema (example)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Sample Property schema (example)
const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
});

const Property = mongoose.model("Property", propertySchema);

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB Connected");

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});

    // Create demo user
    await User.create({
      name: "Demo User",
      email: "demo@realty.com",
      password: "Demo@1234",
    });

    // Create sample properties
    await Property.insertMany([
      {
        title: "Modern Apartment",
        price: 50000,
        location: "Kathmandu",
      },
      {
        title: "Luxury Villa",
        price: 200000,
        location: "Pokhara",
      },
      {
        title: "Small House",
        price: 30000,
        location: "Lalitpur",
      },
    ]);

    console.log("🌱 Database Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedDatabase();
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import socialRoutes from "./routes/social.js";
import premiumRoutes from "./routes/premium.js";
import adminRoutes from "./routes/admin.js";
import achievementRoutes from "./routes/achievements.js";
import galleryRoutes from "./routes/gallery.js";
import db from "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Gallery routes first to handle the listing
app.use("/api/gallery", galleryRoutes);

// Then serve gallery images statically
app.use(
  "/api/gallery",
  express.static("/app/uploads/gallery", {
    dotfiles: "allow",
    maxAge: "1d",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/achievements", achievementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connect to the database and start the server
if (process.env.NODE_ENV !== "test") {
  db.sequelize.sync().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`
Server is running! Available URLs:
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Documentation: http://localhost:5000/api-docs
      `);
    });
  });
}

export default app;

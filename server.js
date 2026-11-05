import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import uploadRoutes from "./src/routes/uploadRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload API
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Document Chatbot server is running!",
    status: "online"
  });
});

// Start server
app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("AI Document Chatbot");
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("--------------------------------");
});

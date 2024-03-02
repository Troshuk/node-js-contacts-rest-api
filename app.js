import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _, res) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { API_PORT } = process.env;

app.listen(API_PORT, () => {
  console.log(`Server is running. Use our API on port: ${API_PORT}`);
});

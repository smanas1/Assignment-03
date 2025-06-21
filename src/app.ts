import express, { Request, Response } from "express";
import booksRoutes from "./app/controllers/books.controller";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

app.use("/api", booksRoutes);

export default app;

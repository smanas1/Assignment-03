import express, { Request, Response } from "express";
import booksRoutes from "./app/controllers/books.controller";
import borrowRoute from "./app/controllers/borrow.controller";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

app.use("/api", booksRoutes);
app.use("/api", borrowRoute);

export default app;

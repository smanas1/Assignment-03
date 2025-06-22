import express, { Request, Response } from "express";
import booksRoutes from "./app/controllers/books.controller";
import borrowRoute from "./app/controllers/borrow.controller";
import { errorHandler } from "./app/error/errorhandler";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management App");
});

app.use("/api", booksRoutes);
app.use("/api", borrowRoute);

app.use((req, res, next) => {
  res
    .status(404)
    .json(
      errorHandler(
        "Route not found",
        false,
        "The requested route does not exist."
      )
    );
});

export default app;

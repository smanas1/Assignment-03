import express, { Request, Response } from "express";
import { BorrowRequest, IBorrowBook } from "../interfaces/borrow.interface";
import { Book } from "../models/books.model";
import { IBooks } from "../interfaces/books.interface";
import { BorrowBook } from "../models/borrow.model";

const borrowRoute = express.Router();

borrowRoute.post(
  "/borrow",
  async (req: Request<{}, {}, BorrowRequest>, res: Response) => {
    try {
      const { book, quantity, dueDate }: BorrowRequest = req.body;
      const updatedBook: IBooks = await Book.borrowBook(book, quantity);

      const borrowRecord = new BorrowBook({
        book: book,
        quantity: quantity,
        dueDate: new Date(dueDate),
      });
      const newData = await borrowRecord.save();
      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: newData,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          message: error.message,
          success: false,
          error: error,
        });
      } else {
        res.status(400).json({
          message: "Validation failed",
          success: false,
          error: error,
        });
      }
    }
  }
);

export default borrowRoute;

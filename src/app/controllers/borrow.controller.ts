import express, { Request, Response } from "express";
import { BorrowRequest, IBorrowBook } from "../interfaces/borrow.interface";
import { Book } from "../models/books.model";
import { IBooks } from "../interfaces/books.interface";
import { BorrowBook } from "../models/borrow.model";

const borrowRoute = express.Router();

borrowRoute.get("/borrow", async (req: Request, res: Response) => {
  try {
    const result = await BorrowBook.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: result,
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
});

borrowRoute.post(
  "/borrow",
  async (req: Request<{}, {}, BorrowRequest>, res: Response) => {
    try {
      const { book, quantity, dueDate }: BorrowRequest = req.body;
      await Book.borrowBook(book, quantity);

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

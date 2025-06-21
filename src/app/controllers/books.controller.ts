import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

const booksRoutes = express.Router();

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Get book by ID

booksRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);
  res.json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

// Get All Books by Query Parameters
booksRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.filter) {
      filter.genre = req.query.filter;
    }

    const sortBy: string = (req.query.sortBy as string) || "title";
    const sortOrder: 1 | -1 = req.query.sort === "desc" ? -1 : 1;
    const sort: any = { [sortBy]: sortOrder };

    const limit: number = parseInt((req.query.limit as string) || "10");
    const allBooks = await Book.find(filter).sort(sort).limit(limit);

    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: allBooks,
    });
  } catch (error) {}
});
// Post Books
booksRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    const books = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: books,
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(400).json({
      message: getErrorMessage(error),
      success: false,
      errors: error,
    });
  }
});

// Update Books

booksRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const book = await Book.findOneAndUpdate(
    { _id: bookId },
    { $set: req.body },
    { new: true }
  );
  res.json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

booksRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedBook = await Book.findByIdAndDelete(bookId);
  res.json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
export default booksRoutes;

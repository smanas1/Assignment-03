import { Document, Model, model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";
import { IBorrowBook } from "../interfaces/borrow.interface";

const BookSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: 3,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      minlength: [3, "Author name must be at least 3 characters long"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      uppercase: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      message:
        "`{VALUE}` is not a valid genre. Available genres are: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: [true, "ISBN Already Exist"],
      trim: true,
      minlength: 10,
    },
    description: {
      type: String,
      required: [true, "Book description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    copies: {
      type: Number,
      required: [true, "Number of copies is required"],
      min: [0, "Number of copies cannot be negative"],
    },
    available: {
      type: Boolean,
      required: [true, "Availability status is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BookSchema.statics.borrowBook = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }
  if (book.copies < quantity) {
    throw new Error("Not enough copies available");
  }
  book.copies -= quantity;

  if (book.copies === 0) {
    book.available = false;
  }
  await book.save();
  return book;
};

export const Book = model<IBooks, Model<IBooks> & IBorrowBook>(
  "Book",
  BookSchema
);

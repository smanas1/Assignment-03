import { Model, model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";

const BookSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    genre: {
      type: String,
      required: true,
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
      required: true,
      unique: [true, "ISBN Already Exist"],
      trim: true,
      minlength: 10,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    copies: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      required: true,
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

export const Book = model<IBooks>("Book", BookSchema);

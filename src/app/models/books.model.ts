import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";

const bookSchema = new Schema<IBooks>(
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

export const Book = model("Book", bookSchema);

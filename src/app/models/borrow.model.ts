import { Schema, model } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const bookBorrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
      dueDate: {
        type: Date,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
export const BookBorrow = model("BookBorrow", bookBorrowSchema);

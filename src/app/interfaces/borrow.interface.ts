import { Document, Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface BorrowRequest {
  book: string;
  quantity: number;
  dueDate: string;
}

export interface IBorrowBook extends Document {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
  borrowDate: Date;
}

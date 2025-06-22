"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const borrow_model_1 = require("../models/borrow.model");
const borrowRoute = express_1.default.Router();
borrowRoute.get("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield borrow_model_1.BorrowBook.aggregate([
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message,
                success: false,
                error: error,
            });
        }
        else {
            res.status(400).json({
                message: "Validation failed",
                success: false,
                error: error,
            });
        }
    }
}));
borrowRoute.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        yield books_model_1.Book.borrowBook(book, quantity);
        const borrowRecord = new borrow_model_1.BorrowBook({
            book: book,
            quantity: quantity,
            dueDate: new Date(dueDate),
        });
        const newData = yield borrowRecord.save();
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: newData,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message,
                success: false,
                error: error,
            });
        }
        else {
            res.status(400).json({
                message: "Validation failed",
                success: false,
                error: error,
            });
        }
    }
}));
exports.default = borrowRoute;

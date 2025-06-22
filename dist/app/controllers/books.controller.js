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
const booksRoutes = express_1.default.Router();
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
// Get book by ID
booksRoutes.get("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield books_model_1.Book.findById(bookId);
    res.json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
    });
}));
// Get All Books by Query Parameters
booksRoutes.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {};
        if (req.query.filter) {
            filter.genre = req.query.filter;
        }
        const sortBy = req.query.sortBy || "title";
        const sortOrder = req.query.sort === "desc" ? -1 : 1;
        const sort = { [sortBy]: sortOrder };
        const limit = parseInt(req.query.limit || "10");
        const allBooks = yield books_model_1.Book.find(filter).sort(sort).limit(limit);
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks,
        });
    }
    catch (error) { }
}));
// Post Books
booksRoutes.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield books_model_1.Book.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: books,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: getErrorMessage(error),
            success: false,
            errors: error,
        });
    }
}));
// Update Books
booksRoutes.put("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield books_model_1.Book.findOneAndUpdate({ _id: bookId }, { $set: req.body }, { new: true });
    res.json({
        success: true,
        message: "Book updated successfully",
        data: book,
    });
}));
booksRoutes.delete("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const updatedBook = yield books_model_1.Book.findByIdAndDelete(bookId);
    res.json({
        success: true,
        message: "Book deleted successfully",
        data: null,
    });
}));
exports.default = booksRoutes;

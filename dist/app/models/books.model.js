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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const BookSchema = new mongoose_1.Schema({
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
        message: "`{VALUE}` is not a valid genre. Available genres are: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
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
}, {
    timestamps: true,
    versionKey: false,
});
BookSchema.statics.borrowBook = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
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
        yield book.save();
        return book;
    });
};
exports.Book = (0, mongoose_1.model)("Book", BookSchema);

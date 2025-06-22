"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = __importDefault(require("./app/controllers/books.controller"));
const borrow_controller_1 = __importDefault(require("./app/controllers/borrow.controller"));
const errorhandler_1 = require("./app/error/errorhandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome to Library Management App");
});
app.use("/api", books_controller_1.default);
app.use("/api", borrow_controller_1.default);
app.use((req, res, next) => {
    res
        .status(404)
        .json((0, errorhandler_1.errorHandler)("Route not found", false, "The requested route does not exist."));
});
exports.default = app;

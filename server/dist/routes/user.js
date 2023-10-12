"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = require("../services/user");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/", (req, res) => {
    try {
        const { name } = req.body;
        const { status, json } = user_1.userService.create({ name });
        return res.status(status).json(json);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error please wait" });
    }
});
exports.userRouter.delete("/", (req, res) => {
    try {
        const { id } = req.body;
        const { status, json } = user_1.userService.delete({ id });
        return res.status(status).json(json);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error please wait" });
    }
});

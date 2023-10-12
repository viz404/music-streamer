import { Router } from "express";
import { userService } from "../services/user";

export const userRouter = Router();

userRouter.post("/", (req, res) => {
  try {
    const { name } = req.body;

    const { status, json } = userService.create({ name });

    return res.status(status).json(json);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error please wait" });
  }
});

userRouter.delete("/", (req, res) => {
  try {
    const { id } = req.body;

    const { status, json } = userService.delete({ id });

    return res.status(status).json(json);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error please wait" });
  }
});

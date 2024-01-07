import { Router } from "express";
import { UserService } from "../services/user";
import { CommonError } from "../services/commonError";

export const userRouter = Router();
const userService = new UserService();
const commonError = new CommonError();

userRouter.post("/users/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw commonError.getMessageError("Required fields not passed");
    }

    const user = await userService.login(username, password);

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
});


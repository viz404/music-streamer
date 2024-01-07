import { CommonError } from "./commonError";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import config from "../utils/config";

const commonError = new CommonError();

export class UserService {
  async login(username: string, password: string) {
    if (!username || !password) {
      throw commonError.getMessageError("Required fields not passed");
    }

    let userDocument = await UserModel.findOne({ username });

    if (!userDocument) {
      const hashedPassword = await bcrypt.hash(password, config.PASSWORD_HASH_SALT_ROUNDS);
      userDocument = await UserModel.create({
        username,
        password: hashedPassword,
      });
    }

    const isValidPassword = await bcrypt.compare(password, userDocument.password);

    if (!isValidPassword) {
      throw commonError.getMessageError("Invalid credentials");
    }

    return {
      userId: userDocument._id,
      username,
    };
  }

  async getUser(userId?: string) {
    const user = await UserModel.findById(userId);
    if (!user) return undefined;
    return {
      userId: user._id,
      username: user.username,
    };
  }
}


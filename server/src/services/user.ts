import { userRepository } from "../repositories/user";
import { ICreate, IDelete } from "../types/user";

class UserService {
  create({ name }: ICreate) {
    try {
      const { id } = userRepository.create({ name });
      return {
        status: 200,
        json: { id },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        json: { error: "Unable to create user" },
      };
    }
  }

  delete({ id }: IDelete) {
    try {
      const { deleted } = userRepository.delete({ id });
      let message = `User ${id} deleted`;
      let status = 200;

      if (deleted === false) {
        status = 400;
        message = `Unable to delete user ${id}`;
      }

      return {
        status,
        json: { message },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        json: { error: "Unable to create user" },
      };
    }
  }
}

export const userService = new UserService();

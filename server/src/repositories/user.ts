import { generateUniqueId } from "../config/helpers";
import {
  ICreate,
  ICreateResponse,
  IDelete,
  IDeleteResponse,
  IUser,
  IUserRepository,
} from "../types/user";

class UserRepository implements IUserRepository {
  private users = new Map<string, IUser>();

  create({ name }: ICreate): ICreateResponse {
    const user: IUser = {
      id: generateUniqueId(),
      name,
    };

    this.users.set(user.id, user);
    return { id: user.id };
  }

  delete({ id }: IDelete): IDeleteResponse {
    const deleted = this.users.delete(id);

    return { deleted };
  }
}

export const userRepository = new UserRepository();

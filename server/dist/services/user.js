"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_1 = require("../repositories/user");
class UserService {
    create({ name }) {
        try {
            const { id } = user_1.userRepository.create({ name });
            return {
                status: 200,
                json: { id },
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                json: { error: "Unable to create user" },
            };
        }
    }
    delete({ id }) {
        try {
            const { deleted } = user_1.userRepository.delete({ id });
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
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                json: { error: "Unable to create user" },
            };
        }
    }
}
exports.userService = new UserService();

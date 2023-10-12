"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const helpers_1 = require("../config/helpers");
class UserRepository {
    constructor() {
        this.users = new Map();
    }
    create({ name }) {
        const user = {
            id: (0, helpers_1.generateUniqueId)(),
            name,
        };
        this.users.set(user.id, user);
        return { id: user.id };
    }
    delete({ id }) {
        const deleted = this.users.delete(id);
        return { deleted };
    }
}
exports.userRepository = new UserRepository();

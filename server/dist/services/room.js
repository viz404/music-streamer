"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = void 0;
const room_1 = require("../constants/room");
const room_2 = require("../repositories/room");
class RoomService {
    create({ user }) {
        try {
            const room = room_2.roomRepository.create({ user });
            return { room };
        }
        catch (error) {
            console.log(error);
            return { error: "Unable to create room" };
        }
    }
    join({ roomId, user }) {
        try {
            const room = room_2.roomRepository.join({ roomId, user });
            return { room };
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === room_1.RoomRepositoryError.INVALID_ROOMID) {
                return { error: error.message };
            }
            return { error: "Unable to join room" };
        }
    }
    delete({ roomId }) {
        try {
            const deleted = room_2.roomRepository.delete({ roomId });
            return { deleted };
        }
        catch (error) {
            console.log(error);
            return { error: "Unable to delete room" };
        }
    }
}
exports.roomService = new RoomService();

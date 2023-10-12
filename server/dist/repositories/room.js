"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRepository = void 0;
const room_1 = require("../constants/room");
class RoomRepository {
    constructor() {
        this.rooms = new Map();
    }
    create({ user }) {
        const room = {
            id: user.id,
            name: `${user.name}'s room`,
            users: [user.id],
        };
        this.rooms.set(room.id, room);
        return room;
    }
    delete({ roomId }) {
        return this.rooms.delete(roomId);
    }
    join({ user, roomId }) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new Error(room_1.RoomRepositoryError.INVALID_ROOMID);
        }
        room.users.push(user.id);
        return room;
    }
}
exports.roomRepository = new RoomRepository();

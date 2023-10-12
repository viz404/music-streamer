import { RoomRepositoryError } from "../constants/room";
import {
  ICreateRoom,
  IDeleteRoom,
  IJoinRoom,
  IRoom,
  IRoomRepository,
} from "../types/room";

class RoomRepository implements IRoomRepository {
  private rooms = new Map<string, IRoom>();

  create({ user }: ICreateRoom): IRoom {
    const room: IRoom = {
      id: user.id,
      name: `${user.name}'s room`,
      users: [user.id],
    };

    this.rooms.set(room.id, room);
    return room;
  }

  delete({ roomId }: IDeleteRoom) {
    return this.rooms.delete(roomId);
  }

  join({ user, roomId }: IJoinRoom): IRoom {
    const room = this.rooms.get(roomId);

    if (!room) {
      throw new Error(RoomRepositoryError.INVALID_ROOMID);
    }

    room.users.push(user.id);
    return room;
  }
}

export const roomRepository = new RoomRepository();

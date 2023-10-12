import { RoomRepositoryError } from "../constants/room";
import { roomRepository } from "../repositories/room";
import { ICreateRoom, IDeleteRoom, IJoinRoom } from "../types/room";

class RoomService {
  create({ user }: ICreateRoom) {
    try {
      const room = roomRepository.create({ user });
      return { room };
    } catch (error) {
      console.log(error);
      return { error: "Unable to create room" };
    }
  }

  join({ roomId, user }: IJoinRoom) {
    try {
      const room = roomRepository.join({ roomId, user });
      return { room };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === RoomRepositoryError.INVALID_ROOMID
      ) {
        return { error: error.message };
      }
      return { error: "Unable to join room" };
    }
  }

  delete({ roomId }: IDeleteRoom) {
    try {
      const deleted = roomRepository.delete({ roomId });
      return { deleted };
    } catch (error) {
      console.log(error);
      return { error: "Unable to delete room" };
    }
  }
}

export const roomService = new RoomService();

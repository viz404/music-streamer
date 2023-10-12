import { IUser } from "./user";

export interface IRoom {
  id: string;
  name: string;
  users: string[];
}

export interface ICreateRoom {
  user: IUser;
}

export interface IJoinRoom extends ICreateRoom {
  roomId: string;
}

export interface IDeleteRoom {
  roomId: string;
}

export interface ISendMessage {
  roomId: string;
  message: string;
  user: IUser;
}

export interface IRoomRepository {
  create({ user }: ICreateRoom): IRoom;
  join({ user, roomId }: IJoinRoom): IRoom;
  delete({ roomId }: IDeleteRoom): boolean;
}

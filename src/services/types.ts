import { Types } from "mongoose";

export interface IUser {
  username: string;
  userId: Types.ObjectId;
}

export interface IVideo {
  title: string;
  author: string;
  thumbnail: string;
  duration: string;
}

export interface IRoom {
  members: IUser[];
  name: string;
  videoUrl: string;
  adminId: Types.ObjectId;
  roomId: string;
}


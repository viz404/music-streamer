import { Router } from "express";
import { RoomService } from "../services/room";

export const roomRouter = Router();
const roomService = new RoomService();

roomRouter.get("/rooms/:roomId/videoUrl", (req, res, next) => {
  try {
    const { roomId } = req.params;

    const videoUrl = roomService.getVideoUrlForRoom(roomId);

    return res.json({
      data: videoUrl,
    });
  } catch (error) {
    next(error);
  }
});

roomRouter.get("/rooms/:roomId/info", (req, res, next) => {
  try {
    const { roomId } = req.params;

    const info = roomService.getBasicRoomInfo(roomId);

    return res.json({
      data: info,
    });
  } catch (error) {
    next(error);
  }
});


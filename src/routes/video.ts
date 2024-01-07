import { Router } from "express";
import { VideoService } from "../services/video";
import { CommonError } from "../services/commonError";

export const videoRouter = Router();
const videoService = new VideoService();
const commonError = new CommonError();

videoRouter.get("/videos/info", async (req, res, next) => {
  try {
    const { videoUrl } = req.query;

    if (!videoUrl) {
      throw commonError.getMessageError("Please pass the videoUrl");
    }

    const info = await videoService.getVideoInfo(String(videoUrl));

    return res.json({
      data: info,
    });
  } catch (error) {
    next(error);
  }
});

videoRouter.get("/videos/stream", async (req, res, next) => {
  try {
    const { videoUrl } = req.query;

    if (!videoUrl) {
      throw commonError.getMessageError("Please pass the videoUrl");
    }

    const stream = videoService.streamAudio(String(videoUrl));

    stream.on("info", (_, format) => {
      res.header("Content-Type", "audio/mpeg");

      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0]);
        const end = parts[1] ? parseInt(parts[1]) : format.contentLength - 1;
        const chunksize = end - start + 1;

        res.status(206);
        res.header(
          "Content-Range",
          `bytes ${start}-${end}/${format.contentLength}`
        );
        res.header("Content-Length", String(chunksize));
      } else {
        res.header("Content-Length", format.contentLength);
      }
    });

    stream.pipe(res, { end: true });
  } catch (error) {
    next(error);
  }
});


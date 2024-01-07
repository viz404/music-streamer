import ytdl from "ytdl-core";
import { CommonError } from "./commonError";

const commonErrors = new CommonError();

export class VideoService {
  async getVideoInfo(url: string) {
    const validUrl = this.validateUrl(url);

    if (!validUrl) {
      throw commonErrors.getMessageError("Invalid videoUrl");
    }

    const info = await ytdl.getInfo(url);

    return {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[0].url,
      duration: info.videoDetails.lengthSeconds,
    };
  }

  validateUrl(url: string) {
    return ytdl.validateURL(url);
  }

  streamAudio(url: string) {
    if (!this.validateUrl(url)) {
      throw {
        customError: true,
        message: "Invalid videoUrl",
      };
    }

    return ytdl(String(url), {
      filter: "audioonly",
      quality: "lowest",
    });
  }
}

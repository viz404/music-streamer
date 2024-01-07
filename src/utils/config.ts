import { config } from "dotenv";
config();

export default {
  PORT: process.env.PORT,
  ALLOWED_ORIGINS: JSON.parse(process.env.ALLOWED_ORIGINS || ""),
  DB_URI: `mongodb+srv://${process.env.MONGODB_CLUSTER_NAME}:${process.env.MONGODB_CLUSTER_PASSWORD}@cluster0.mnoiz7w.mongodb.net/music-streamer`,
  PASSWORD_HASH_SALT_ROUNDS: 10,
};


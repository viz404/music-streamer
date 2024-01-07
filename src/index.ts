import mongoose from "mongoose";
import { server } from "./app";
import config from "./utils/config";

mongoose.connect(config.DB_URI).then(() => {
  console.log("Database connected");
  server.listen(config.PORT, () => {
    console.log("Server is running on port", config.PORT);
  });
}).catch(error => console.log("Database connection failed: ", error));


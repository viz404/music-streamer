import { NextFunction, Request, Response } from "express";
import config from "../utils/config";

export function corsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const origin = req.headers.origin || "";

  if (config.ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  } else {
    return res.status(401).json({
      error: {
        message: "Unauthorized request",
      },
    });
  }
  next();
}

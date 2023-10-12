import crypto from "node:crypto";

export function generateUniqueId() {
  return crypto.randomUUID();
}

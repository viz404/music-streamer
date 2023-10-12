import { THttpMethod } from "./General/general.types";

export const HttpMethod: Record<THttpMethod, THttpMethod> = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

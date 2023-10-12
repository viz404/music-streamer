import keys from "../keys";
import { IMakeHttpRequest } from "./general.types";

class General {
  async makeHttpRequest({
    url,
    method,
    body,
    headers,
    queryParams,
  }: IMakeHttpRequest) {
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${url}?${queryString}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    url = keys.BACKEND_URL + url;

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error making HTTP request:", error);
      throw error;
    }
  }
}

export const general = new General();

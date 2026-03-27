import { logger } from "@/utils/logger";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

const BASE_URL = "https://api.crossref.org";

export async function http<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(path, BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  logger.info(`GET ${url.toString()}`);

  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch {
    throw new HttpError(
      "Network error. Please check your connection.",
      0,
      "Network Error",
    );
  }

  if (!response.ok) {
    const message =
      response.status >= 500
        ? "The Crossref service is temporarily unavailable. Please try again later."
        : "Something went wrong with your request. Please adjust your search and try again.";

    throw new HttpError(message, response.status, response.statusText);
  }

  return response.json() as Promise<T>;
}

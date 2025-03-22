import dotenv from "dotenv";

dotenv.config();

export class BaseApi {
  readonly apiBaseUrl: string = process.env.API_BASE_URL ?? "https://api.demoblaze.com";
  readonly apiHeaders: object = {
    accept: "*/*",
    "content-type": "application/json",
    origin: "https://www.demoblaze.com",
    referer: "https://www.demoblaze.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.35 Safari/537.36",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US",
  };
}

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// everything using `id` user from auth.api

// general api
export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(25, "30 s"),
});

// petugas, warga, warung api
export const userRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "30 s"),
});

// admin api
export const adminRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "30 s"),
});

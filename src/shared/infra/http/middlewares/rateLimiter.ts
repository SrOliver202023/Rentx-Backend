import dotenv from 'dotenv';
dotenv.config();

import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import * as redis from 'redis';

import { AppError } from '@shared/errors/AppError';

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    }
  });

  await redisClient.connect();

  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: Number(process.env.APP_LIMIT_REQUESTS), // 10 requests
    duration: Number(process.env.APP_DURATION_REQUESTS), // per 1 second by IP

  });

  try {
    const getLimiter = await limiter.consume(request.ip);
    if (getLimiter.consumedPoints === Number(process.env.APP_LIMIT_REQUESTS)) {
      throw new AppError("Too many requests", 429);
    }
    return next();
  } catch (error) {
    throw new AppError("Too many requests", 429);
  }
}
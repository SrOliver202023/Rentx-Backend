import dotenv from 'dotenv';
dotenv.config();

import upload from '@config/upload';
import createConnection from "@shared/infra/typeorm";

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import { AppError } from '../../errors/AppError';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import swaggerUi from 'swagger-ui-express';
import { router } from './routes';
import swaggerFile from '../../../swagger.json';

import cors from 'cors';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';

import "@shared/container";

createConnection();

const app = express();

app.use(rateLimiter);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());

app.use('/cars', express.static(`${upload.tmpFolder}/cars/`));
app.use('/avatar', express.static(`${upload.tmpFolder}/avatar/`));

app.get('/test', (req, res) => res.json({ msg: "Hello World!" }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/test', (req, res) => {
  return res.status(200).json({ msg: "Hello people!" });
});

app.use(router);

app.use(Sentry.Handlers.errorHandler());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ status: "error", message: `Internal server error - ${err.message}`, describe: err });
});

export { app };
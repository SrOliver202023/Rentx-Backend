import dotenv from 'dotenv';
dotenv.config();

import upload from '@config/upload';
import createConnection from "@shared/infra/typeorm";

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { AppError } from '../../errors/AppError';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes';
import swaggerFile from '../../../swagger.json';

import "@shared/container";

createConnection(process.env.NODE_ENV);

const app = express();

app.use(express.json());

app.use('/cars', express.static(`${upload.tmpFolder}/cars/`));
app.use('/avatar', express.static(`${upload.tmpFolder}/avatar/`));

app.get('/test', (req, res) => res.json({ msg: "Hello World!" }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/test', (req, res) => {
  return res.status(200).json({ msg: "Hello people!" });
});

app.use(router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ status: "error", message: `Internal server error - ${err.message}`, describe: err });
});

export { app };
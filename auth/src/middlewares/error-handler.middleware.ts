import debug from "debug";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom.error";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:index");

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError)
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });

  return res
    .status(400)
    .send({ errors: [{ message: "Something went wrong!" }] });
};

import debug from "debug";
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection.error";
import { RequestValidationError } from "../errors/request-validation.error";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:signupRoute");

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    check("email").isEmail().withMessage("Email must be valid!"),
    check("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 & 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    //if errors exist
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password }: { email: string; password: string } = req.body;

    debugx({ email, password });
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };

import { BadRequestError, validateRequest } from "@scalafrica/ticket-common";
import debug from "debug";
import express, { Request, Response } from "express";
import { check } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Password } from "../services/password";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:signinRoute");

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    check("email").isEmail().withMessage("Email must be valid!"),
    check("password")
      .trim()
      .notEmpty()
      .withMessage("Password must be provided."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new BadRequestError("Invalid credentials!");

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) throw new BadRequestError("Invalid credentials!");

    //generate jwt
    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    //store in session object.
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };

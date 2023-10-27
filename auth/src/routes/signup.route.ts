import debug from "debug";
import express, { Request, Response } from "express";
import { check } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request.error";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { User } from "../models/user.model";
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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new BadRequestError("Account already exists!");

    const user = User.build({ email, password });
    await user.save();

    //generate jwt
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    //store in session object.
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };

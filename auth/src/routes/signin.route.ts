import debug from "debug";
import express from "express";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:signinRoute");

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send("Signing in!");
});

export { router as signinRouter };

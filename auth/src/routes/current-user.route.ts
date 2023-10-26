import debug from "debug";
import express from "express";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:currentUserRoute");

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  debugx("peter parker here is a spider man! france");
  res.send("Hi team! never mind with them always,geopolitical!");
});

export { router as currentUserRouter };

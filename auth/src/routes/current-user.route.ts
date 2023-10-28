import { currentUser } from "@scalafrica/ticket-common";
import debug from "debug";
import express from "express";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:currentUserRoute");

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

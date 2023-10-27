import debug from "debug";
import express from "express";
import { utilInspection } from "../utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketAuth:signoutRoute");

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

export { router as signoutRouter };

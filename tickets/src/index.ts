import debug from "debug";
import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { utilInspection } from "./utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketTicket:index");

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  try {
    //connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);
    debugx("connected to mongodb");
  } catch (e) {
    debugx(e);
  }
};

app.listen(3000, () => console.log("listening on port 3000!!!"));

start();

import debug from "debug";
import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { utilInspection } from "./utils/helper.util";

debug.formatters.O = (v) => utilInspection(v);
const debugx = debug("ticketTicket:index");

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must be defined");

  try {
    //connect
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed!");
      process.exit();
    });
    process.on("SIGNINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);
    debugx("connected to mongodb");
  } catch (e) {
    debugx(e);
  }
};

app.listen(3000, () => console.log("listening on port 3000!!!"));

start();

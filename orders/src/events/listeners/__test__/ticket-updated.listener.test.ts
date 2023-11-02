import { TicketUpdatedEvent } from "@scalafrica/ticket-common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated.listener";

const setup = async () => {
  //create instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create & save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "pillow",
    price: 10,
    userid: new mongoose.Types.ObjectId().toHexString(),
  };

  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  //return payload.
  return { listener, data, msg, ticket };
};

it("finds,updates & saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not ack if event has skipped version number", async () => {
  const { listener, data, msg, ticket } = await setup();
  //call the onMessage function with the data object + message object
  data.version = 13;
  try {
    await listener.onMessage(data, msg);
  } catch (e) {}

  expect(msg.ack).not.toHaveBeenCalled();
});

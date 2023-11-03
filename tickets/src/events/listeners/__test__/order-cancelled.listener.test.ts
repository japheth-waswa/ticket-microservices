import { OrderCancelledEvent } from "@scalafrica/ticket-common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled.listener";

const setup = async () => {
  //create instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  //create & save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 89,
    userId: "8s9sfs",
  });

  ticket.set({ orderId });
  await ticket.save();

  //create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };

  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, ticket, msg };
};

it("update,publishes & acks the message", async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();

  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

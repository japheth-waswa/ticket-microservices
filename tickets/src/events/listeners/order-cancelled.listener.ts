import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@scalafrica/ticket-common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    // find the ticket that the order is reserving.
    const ticket = await Ticket.findById(data.ticket.id);

    //if no ticket,throw error.
    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ orderId: undefined });

    //save ticket.
    await ticket.save();

    //publish event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userid: ticket.userId,
      orderId: ticket.orderId,
    });

    //ack the message.
    msg.ack();
  }
}

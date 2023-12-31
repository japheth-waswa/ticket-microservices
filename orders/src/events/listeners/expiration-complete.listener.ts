import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@scalafrica/ticket-common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: ExpirationCompleteEvent["data"],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) throw new Error("Order not found.");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}

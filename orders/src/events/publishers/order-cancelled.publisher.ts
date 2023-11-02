import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@scalafrica/ticket-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@scalafrica/ticket-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

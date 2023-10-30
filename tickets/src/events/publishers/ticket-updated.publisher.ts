import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@scalafrica/ticket-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

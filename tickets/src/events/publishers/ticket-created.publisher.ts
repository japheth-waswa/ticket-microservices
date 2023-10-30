import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@scalafrica/ticket-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

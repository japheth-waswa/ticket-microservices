import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@scalafrica/ticket-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

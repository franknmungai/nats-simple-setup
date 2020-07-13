import { Publisher } from './Publisher';
import { TicketCreatedEvent } from './ticket-created-event'; // Describes the subject and data of a ticket created event
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

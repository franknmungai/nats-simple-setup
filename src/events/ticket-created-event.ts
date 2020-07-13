import { Subjects } from './subjects';

// Described the subject and data of a ticket created event
export interface TicketCreatedEvent {
	subject: Subjects.TicketCreated;
	data: {
		id: string;
		title: string;
		price: number;
	};
}

import { Message } from 'node-nats-streaming';
import { Listener } from './Listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
	queueGroupName = 'payments-service'; //name of our service

	onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		console.log('Event data', data); //Business logic 🚌

		msg.ack(); //acknowledge event
	}
}

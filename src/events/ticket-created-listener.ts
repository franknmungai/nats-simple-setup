import { Message } from 'node-nats-streaming';
import { Listener } from './Listener';

export class TicketCreatedListener extends Listener {
	subject = 'ticket:created';
	queueGroupName = 'payments-service'; //name of our service

	onMessage(data: any, msg: Message) {
		console.log('Event data', data); //Business logic 🚌
		msg.ack(); //acknowledge event
	}
}

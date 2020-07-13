import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// Connect to a nats-server and return the client
const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	console.log('Publisher connected to NATS');

	const publisher = new TicketCreatedPublisher(stan);

	// const data = JSON.stringify({
	// 	id: '123',
	// 	name: 'concert',
	// 	price: 20,
	// });
	// stan.publish('ticket:created', data, () => {
	// 	console.log('Event published');
	// });

	publisher.publish({
		id: '123',
		title: 'Concert',
		price: 20,
	});
});

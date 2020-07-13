import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	console.log('Listener connected to NATS');

	new TicketCreatedListener(stan).listen();

	stan.on('close', () => {
		console.log('NATS listener client connection closed');
		process.exit();
	});
});

// Close connection to NATS server on interrupt signal
process.on('SIGINT', () => stan.close());
// Close connection to NATS server on terminate signal
process.on('SIGTERM', () => stan.close());

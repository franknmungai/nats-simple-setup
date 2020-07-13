import nats from 'node-nats-streaming';

// Connect to a nats-server and return the client
const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	console.log('Publisher connected to NATS');

	// All data sent through NATS streaming must be in JSON/strings
	const data = JSON.stringify({
		id: '123',
		name: 'concert',
		price: 20,
	});
	stan.publish('ticket:created', data, () => {
		// An acknowledgement callback called after the event/channel is received
		console.log('Event published');
	});
});

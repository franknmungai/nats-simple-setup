import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

abstract class Listener {
	//abstract keyword marks required properties that must be implemented in our subclasses
	abstract subject: string;
	abstract queueGroupName: string;
	abstract onMessage(data: any, message: Message): void;
	private client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	// Create some subscription options
	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setManualAckMode(true) //Configures the subscription to require manual acknowledgement
			.setAckWait(this.ackWait)
			.setDeliverAllAvailable() //send all available messages
			.setDurableName(this.queueGroupName); //make sure we receive only events/messages we did not acknowedge by marking events with this name
	}

	// Create a subscription and listen for events
	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on('message', (msg: Message) => {
			console.log(
				`Message received: ${this.subject} -> ${this.queueGroupName}`
			);

			const parsedMessage = this.parseMessage(msg);
			// Pass event data to child class
			this.onMessage(parsedMessage, msg);
		});
	}

	parseMessage(msg: Message) {
		const data = msg.getData();

		return typeof data === 'string'
			? JSON.parse(data)
			: JSON.parse(data.toString('utf-8')); //Buffer
	}
}

class TicketCreatedListener extends Listener {
	subject = 'ticket:created';
	queueGroupName = 'payments-service'; //name of our service

	onMessage(data: any, msg: Message) {
		console.log('Event data', data); //Business logic 🚌
		msg.ack(); //acknowledge event
	}
}

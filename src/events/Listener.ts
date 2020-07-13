import { Stan, Message } from 'node-nats-streaming';

export abstract class Listener {
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

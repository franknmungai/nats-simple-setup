import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
	subject: Subjects; //can be any value in our enum
	data: any;
}
// Defines a base class for creating event publishers or event-emmiters
export abstract class Publisher<T extends Event> {
	abstract subject: T['subject'];
	private client: Stan;

	constructor(client: Stan) {
		this.client = client;
	}

	// All data sent through NATS streaming must be in JSON/strings
	publish(data: T['data']): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client.publish(this.subject, JSON.stringify(data), (err) => {
				//we receive an error in our ack cb as the first argument
				if (err) {
					return reject();
				}
				resolve();
				console.log('Published to ' + this.subject);
			});
		});
	}
}

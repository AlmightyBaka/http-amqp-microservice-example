import { Connection, Consumer, RPCClient } from 'rabbitmq-client'

import logger from './log/logger.js'

const AMQP_URL = process.env.AMQP_URL

class QueueClient {
	public connected: boolean = false
	protected rabbit: Connection

	constructor() {
		this.rabbit = new Connection(AMQP_URL)

		this.rabbit.on('error', (err) => {
			logger.error(err)
		})
		this.rabbit.on('connection', () => {
			logger.info(`connected to ${AMQP_URL}`)
			this.connected = true
		})
		this.rabbit.on('connection.blocked', () => {
			logger.warn(`connection blocked`)
		})
		this.rabbit.on('connection.unblocked', () => {
			logger.info(`connection unblocked`)
		})
	}

	async close(): Promise<void> {
		await this.rabbit.close()
		this.connected = false
	}
}

class ConsumerClient extends QueueClient {
	protected consumers: Consumer[]

	constructor() {
		super()

		this.consumers = []
	}

	openChannel(channel: string, callback: (message: any) => Promise<any>) {
		const consumer = this.rabbit.createConsumer({
			queue: channel,
			// handle 2 messages at a time
			qos: { prefetchCount: 2 },
		}, async (req, reply) => {
			logger.info(`/${channel}: message received`)
			
			const result = await callback(req.body)
			logger.info(`/${channel}: completed`)

			reply(result)
		})
		consumer.on('error', (err) => {
			logger.error(err, `/${channel}: ${err}`)
		})
		consumer.on('ready', () => {
			logger.info(`/${channel}: connection established`)
		})

		this.consumers.push(consumer)
	}

	async close(): Promise<void> {
		this.consumers.forEach(async (consumer) => {
			await consumer.close()
		})
		await super.close()
	}
}

class RpcClient extends QueueClient {
	protected client: RPCClient

	constructor() {
		super()

		this.client = this.rabbit.createRPCClient({
			 confirm: true,
		})
	}

	async send<T>(channel: string, message: any): Promise<T> {
		const res = await this.client.send(channel, message)

		return res.body as T
	}

	async close(): Promise<void> {
		await this.client.close()
		await super.close()
	}
}

export { ConsumerClient, RpcClient }

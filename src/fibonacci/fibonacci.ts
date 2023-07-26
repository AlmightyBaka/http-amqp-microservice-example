import { setTimeout } from 'timers/promises'

import logger from '../util/log/logger.js'
import { ConsumerClient } from '../util/queue.js'

const CHANNEL_NAME = 'fibonacci'

function getFibonacciClient() {
	async function fakeFibonacci(count: number): Promise<number> {
		await setTimeout(1000 * count)

		return count
	}

	async function callback(message: any): Promise<number> {
		if (typeof (message) !== 'number') {
			throw new Error(`/${CHANNEL_NAME}: request body is not a number`)
		}

		logger.info(`/${CHANNEL_NAME}: calculating fibonacci...`)
		const result = await fakeFibonacci(message)
		logger.info(`/${CHANNEL_NAME}: fibonacci result: ${result}`)
	
		return result
	}

	const consumer = new ConsumerClient()
	consumer.openChannel(CHANNEL_NAME, callback)

	return consumer
}

export default getFibonacciClient

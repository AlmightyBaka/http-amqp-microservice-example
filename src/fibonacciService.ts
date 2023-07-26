import 'dotenv-defaults/config.js'

import bindExitHandler from './util/exitHandler.js'
import logger from './util/log/logger.js'
import getFibonacciClient from './fibonacci/fibonacci.js'

// handling process errors
bindExitHandler(async () => {
	if (consumer.connected) {
		logger.info('closing queue client connection')
		await consumer.close()
	}
	logger.info('service closed')
})

// initializing queue connection
const consumer = getFibonacciClient()

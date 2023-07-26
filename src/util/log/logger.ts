import pino from 'pino'

const NAME = process.env.SERVICE_NAME

const logger = pino({
	name: NAME,
	level: 'debug',
	// Pino advises against using pino-pretty programmatically,
	// but for simplicity's sake I'm leaving this in; see: 
	// https://github.com/pinojs/pino-pretty#programmatic-integration
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
})

export default logger
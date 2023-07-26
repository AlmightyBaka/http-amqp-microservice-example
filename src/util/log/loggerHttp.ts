import pinohttp from 'pino-http'
import logger from './logger.js'

const loggerHttp = pinohttp({
	logger,
	// supressing favicon request logging
	autoLogging: {
		ignore: (req): boolean => {
			if (req.url === '/favicon.ico') {
				return true
			}
			return false
		}
	},
	// supressing detailed express logging
	serializers: {
		req () {},
		res () {},
		err () {},
	},
	customReceivedMessage: (req, res) => {
		return `${req.method} ${req.url}: request received`
	},
	customSuccessMessage: (req, res) => {
		if (res.statusCode === 404) {
			return `${req.method} ${req.url}: resource not found`
		}
		return `${req.method} ${req.url}: completed`
	},
	customErrorMessage: (req, res, err) => {
		return `${req.method} ${req.url}: ${err}`
	},
})

export default loggerHttp
// re-exporting original logger for convenience
export { logger }

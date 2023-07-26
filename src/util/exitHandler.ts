import logger from './log/logger.js'

async function exitHandler(callback?: Function, code: number = 0): Promise<void> {
	if (callback) {
		await callback()
	}
	process.exit(code)
}

function bindExitHandler(callback?: Function): void {
	async function unexpectedErrorHandler(error: Error): Promise<void> {
		logger.error(error)
		await exitHandler(callback, 1)
	}
	async function signalReceivedHandler(signal: string): Promise<void> {
		logger.warn(`${signal} received; closing process`)
		await exitHandler(callback, 0)
	}

	process.on('uncaughtException', unexpectedErrorHandler)
	process.on('unhandledRejection', unexpectedErrorHandler)

	process.on('SIGTERM', async () => { await signalReceivedHandler('SIGTERM') })
	process.on('SIGINT', async () => { await signalReceivedHandler('SIGINT') })

	process.on('beforeExit', async (code) => { await exitHandler(callback, code) })
}

export default bindExitHandler
export { exitHandler }
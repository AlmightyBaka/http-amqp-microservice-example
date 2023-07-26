import 'dotenv-defaults/config.js'
import { Server } from 'http'

import bindExitHandler from './util/exitHandler.js'
import logger from './util/log/logger.js'
import { RpcClient } from './util/queue.js'
import getApp from './http/app.js'

const PORT = process.env.HTTP_PORT

// handling process errors
bindExitHandler(async () => {
	if (server.listening) {
		logger.info('closing http server')
		await new Promise<void>((res) => {
			server.close(() => res())
		})
	}
	if (rpcClient.connected) {
		logger.info('closing queue client connection')
		await rpcClient.close()
	}
	logger.info('service closed')
})

// setting up rpc client
const rpcClient = new RpcClient()

// setting up http server
const app = getApp(rpcClient)

let server: Server
try {
	server = app.listen(PORT, () => {
		logger.info(`running server on http://localhost:${PORT}/`)
	})
} catch (error) {
	logger.fatal(error, `failed to open server at port ${PORT}`)
}
  
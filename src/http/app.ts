import express, { Express, ErrorRequestHandler } from 'express'

import { RpcClient } from '../util/queue.js'
import loggerHttp from '../util/log/loggerHttp.js'
import getRouter from './router.js'

function getApp(rpcClient: RpcClient): Express {
	const app = express()
	
	// adding logger
	app.use(loggerHttp)
	
	// setting up paths
	app.use('/', getRouter(rpcClient))

	// handling http errors
	const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
		res.err = err
		res.status(500).send(err.message)
	}
	app.use(errorHandler)

	return app
}

export default getApp

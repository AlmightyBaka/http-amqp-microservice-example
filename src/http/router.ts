import { Router, Request } from 'express'

import { RpcClient } from '../util/queue.js'

function getRouter(rpcClient: RpcClient): Router {
	const router = Router()
	
	type FibonacciRequest = Request<{}, string, {}, { n?: string }>
	router.get('/fibonacci', async (req: FibonacciRequest, res, next) => {
		const count = Number.parseInt(req.query.n as string) || 0

		let fibonacci: number
		try {
			fibonacci = await rpcClient.send<number>('fibonacci', count)
		} catch (error) {
			return next(error)
		}

		res.send(`Your fibonacci is: ${fibonacci}`)
	})

	router.get('/error', (req, res) => {
		throw new Error('test error handling')
	})

	return router
}

export default getRouter
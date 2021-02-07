import Express from 'express'
import {PoolConnection} from 'mysql'

declare global {
	namespace Express {
		interface Request {
			database: {
				connection?: PoolConnection;
			};
		}
	}
}

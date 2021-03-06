import Express from 'express'
import {PoolConnection} from 'mysql'

declare global {
	namespace Express {
		interface Request {
			database: {
				/**
				 * This is a connection to the database
				 */
				connection?: PoolConnection;
			};
		}
	}
}

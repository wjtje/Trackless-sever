// Copyright (c) 2020 Wouter van der Wal

import Express from 'express'

declare global {
	namespace Express {
		interface User {
			firstname: string;
			lastname: string;
			username: string;
			userID: number;
			groupID: number;
		}
	}
}

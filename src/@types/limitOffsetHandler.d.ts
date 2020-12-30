// Copyright (c) 2020 Wouter van der Wal
/* eslint-disable @typescript-eslint/no-unused-vars */

import Express from 'express'

declare global {
  namespace Express {
    interface Request {
      /**
       * This will define the limit and offset settings for the sql command
       */
      queryLimitOffset?: string;
    }
  }
}

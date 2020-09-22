// Copyright (c) 2020 Wouter van der Wal
/* eslint-disable @typescript-eslint/no-unused-vars */

import Express from 'express'

declare global {
  namespace Express {
    interface Request {
      querySort?: string;
    }
  }
}

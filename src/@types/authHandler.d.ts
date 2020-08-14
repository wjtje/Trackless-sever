// TypeScript Version: 2.3

import Express from 'express';

declare global {
  namespace Express {
    interface User {
      firstname: string;
      lastname: string;
      username: string;
      userId: number;
      groupId: number;
    }
  }
}

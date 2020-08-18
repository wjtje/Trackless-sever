// Copyright (c) 2020 Wouter van der Wal

import { NextFunction } from 'express';
import { sqlError } from './error';
import { MysqlError } from 'mysql';

/**
 * A function for handling a query
 * 
 * @since 0.2-beta.1
 * @param response 
 * @param errorMessage 
 * @param then 
 */
export function handleQuery(next: NextFunction, then: (result: any) => void) {
  return (error: MysqlError | null, result: any[]) => {
    if (error) {
      sqlError(next, error, 'Internal database error');
    } else {
      then(result);
    }
  };
}
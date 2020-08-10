import { NextFunction } from 'express';
import { sqlError } from './error';
import { databaseError } from '../global/language';

/**
 * A function for handling a query
 * 
 * @since 0.2-beta.1
 * @param response 
 * @param errorMessage 
 * @param then 
 */
export function handleQuery(next: NextFunction, then: (result: any) => void) {
  return (error, result) => {
    if (error) {
      sqlError(next, error, databaseError);
    } else {
      then(result);
    }
  };
}
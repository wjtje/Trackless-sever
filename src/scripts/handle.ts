import { Response, Request } from 'express';
import { sqlError } from './error';

/**
 * A function for handling a query
 * 
 * @since 0.2-beta.1
 * @param response 
 * @param errorMessage 
 * @param then 
 */
export function handleQuery(response: Response, then: (result: any) => void) {
  return (error, result) => {
    if (error) {
      sqlError(response, error, 'Something went wrong while contacting the database.');
    } else {
      then(result);
    }
  };
}
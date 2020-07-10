// Static strings
export const groupNotFound        = 'The group is not found.';
export const methodNotAllowd      = 'The method is not allowed.';
export const group0noAccess       = 'group_id 0 does not have any access.';
export const noAccess             = 'You don\'t have access to do that';
export const checkUsernamePasswd  = 'Please check your username or password.';
export const accountNotFound      = 'Could not find your account.';
export const databaseError        = 'Something went wrong while contacting the database.';
export const accessNoNumber       = 'access_id needs to be a valid number.';
export const apiNoNumber          = 'api_id needs to be a valid number.';
export const groupNoNumber        = 'group_id needs to be a valid number.';
export const locationNoNumber     = 'location_id needs to be a valid number.';
export const userNoNumber         = 'user_id needs to be a valid number.';
export const workNoNumber         = 'work_id needs to be a valid number.';
export const errorRequestBody     = 'Your requestBody contains something wrong.';
export const request200           = 'Success.';
export const request201           = 'Your request has been fulfilled.';
export const request400           = 'There is something wrong with your request.'
export const request403           = 'You don\'t have access to do this request.';
export const request404           = 'The resource you are looking for is not here.';
export const request500           = 'Something internally went wrong.';
export const usernameTaken        = 'The username is already taken. Please choose an other one.';
export const locationIdNotValid   = 'location_id is not valid.';
export const apiFunctionNotFound  = 'Couldn\'t found that api function';

// Dynamic strings
export const methodNotFound       = (method: string, url:string) => {
  return `There is no method '${method}' on '${url}'`;
}
export const UNAUTHENTICATED_ERROR = 'unauthenticated';
export const ALREADY_AUTHENTICATED_ERROR = 'already_authenticated';


/**
 * 
 * to make variable as record key, use bracket [] around,
 * e.g. [VARIABLE_NAME]. Otherwise, value look up will be undefined 
 * 
 */
export const ERROR_MESSAGES: Record<string, string>  = {
    [UNAUTHENTICATED_ERROR]: "You need to login first",
    [ALREADY_AUTHENTICATED_ERROR]: "You are already authenticated",
}
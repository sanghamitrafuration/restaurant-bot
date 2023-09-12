// httpStatusCodes.ts

// Success codes
export const OK:number = 200;
export const CREATED:number = 201;
export const NO_CONTENT:number = 204;


// Client error codes
export const BAD_REQUEST:number = 400;
export const UNAUTHORIZED:number = 401;
export const FORBIDDEN:number = 403;
export const NOT_FOUND:number = 404;
export const CONFLICT:number = 409;
export const UNPROCESSABLE_ENTITY:number = 422;
export const TOO_MANY_REQUESTS:number = 429;


// Server error codes
export const INTERNAL_SERVER_ERROR:number = 500;
export const SERVICE_UNAVAILABLE:number = 503;

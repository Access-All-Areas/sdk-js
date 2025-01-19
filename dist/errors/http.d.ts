export declare class HTTPError extends Error {
    name: string;
    response: Response;
    request: Request;
    constructor(response: Response, request: Request);
}
export declare class HTTPAuthorizationError extends HTTPError {
    name: string;
}
export declare class HTTPNotFoundError extends HTTPError {
    name: string;
}
export declare class HTTPBadRequestError extends HTTPError {
    name: string;
}
export declare class HTTPInternalServerError extends HTTPError {
    name: string;
}
export declare class HTTPForbiddenError extends HTTPError {
    name: string;
}
export declare class HTTPTimeoutError extends HTTPError {
    name: string;
}

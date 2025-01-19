export declare class URLValidationError extends Error {
}
export declare class URLParsingError extends URLValidationError {
    constructor(url: unknown);
}

export declare class StrapiSDKError extends Error {
    constructor(cause?: unknown, message?: string);
}
export declare class StrapiSDKValidationError extends StrapiSDKError {
    constructor(cause?: unknown, message?: string);
}
export declare class StrapiSDKInitializationError extends StrapiSDKError {
    constructor(cause?: unknown, message?: string);
}

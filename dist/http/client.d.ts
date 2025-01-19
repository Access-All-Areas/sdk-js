import { AuthManager } from '../auth';
import { URLValidator } from '../validators';
/**
 * Strapi SDK's HTTP Client
 *
 * Provides methods for configuring the base URL, authentication strategies,
 * and for performing HTTP requests with automatic header management and URL validation.
 */
export declare class HttpClient {
    private _baseURL;
    private readonly _authManager;
    private readonly _urlValidator;
    constructor(baseURL: string, authManager?: AuthManager, urlValidator?: URLValidator);
    /**
     * Gets the currently set base URL.
     *
     * @returns The base URL used for HTTP requests.
     */
    get baseURL(): string;
    /**
     * Sets a new base URL for the HTTP client and validates it.
     *
     * @param url - The new base URL to set.
     *
     * @returns The HttpClient instance for chaining.
     *
     * @throws {URLParsingError} If the URL cannot be parsed.
     *
     * @example
     * const client = new HttpClient('http://example.com');
     *
     * client.setBaseURL('http://newexample.com');
     */
    setBaseURL(url: string): this;
    /**
     * Sets the authentication strategy for the HTTP client.
     *
     * Configures how the client handles authentication based on the specified strategy and options.
     *
     * @param strategy - The authentication strategy to use.
     * @param options - Additional options required for the authentication strategy.
     *
     * @throws {StrapiSDKError} If the given strategy is not supported
     *
     * @returns The HttpClient instance for chaining.
     *
     * @example
     * client.setAuthStrategy('api-token', { token: 'abc123' });
     */
    setAuthStrategy(strategy: string, options: unknown): this;
    /**
     * Performs an HTTP fetch request to the specified URL.
     *
     * Attaches the necessary headers, authenticates if required, and handles unauthorized errors.
     *
     * @param path - The path to which the request is made, appended to the base URL.
     * @param [init] - Optional object containing any custom settings to apply to the fetch request.
     *
     * @returns A promise that resolves to the HTTP response.
     *
     * @throws {Error} If the authentication can't be completed, or if the server can't be reached
     *
     * @example
     * client.fetch('/data')
     *  .then(response => response.json())
     *  .then(data => console.log(data));
     */
    fetch(path: string, init?: RequestInit): Promise<Response>;
    /**
     * Handles HTTP fetch error logic.
     *
     * It deals with unauthorized responses by delegating the handling of the error to the authentication manager.
     *
     * @param error - The original HTTP request object that encountered an error. Used for error handling.
     *
     * @see {@link AuthManager#handleUnauthorizedError} for handling unauthorized responses.
     */
    private handleFetchError;
    /**
     * Executes an HTTP fetch request using the Fetch API.
     *
     * @param input - The target of the HTTP request which can be a string URL or a `Request` object.
     * @param [init] - An optional `RequestInit` object that contains any custom settings that you want to apply to the request.
     *
     * @returns A promise that resolves to the `Response` object representing the complete HTTP response.
     *
     * @throws {HTTPError} if the request fails
     *
     * @additionalInfo
     * - This method doesn't perform any authentication or header customization.
     *   It directly passes the parameters to the global `fetch` function.
     * - To include authentication, consider using the `fetch` method from the `HttpClient` class, which handles headers and authentication.
     */
    _fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    /**
     * Attaches default and authentication headers to an HTTP request.
     *
     * This method ensures that a default 'Content-Type' header is set for the request if it is not already specified.
     *
     * It also delegates to the AuthManager to append any necessary authentication headers,
     * potentially overwriting existing ones to ensure correct authorization.
     *
     * @param request - The HTTP request object to which headers are added.
     */
    private attachHeaders;
    private setContentTypeHeader;
    /**
     * Maps an HTTP response's status code to a specific HTTP error class.
     *
     * @param response - The HTTP response object obtained from a failed HTTP request,
     *                   which contains the status code and reason for failure.
     * @param request - The original HTTP request object that resulted in the error response.
     *
     * @returns A specific subclass instance of HTTPError based on the response status code.
     *
     * @throws {HTTPError} or any of its subclass.
     *
     * @see {@link StatusCode} for all possible HTTP status codes and their meanings.
     */
    private mapResponseToHTTPError;
}

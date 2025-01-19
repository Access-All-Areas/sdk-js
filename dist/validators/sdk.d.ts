import { URLValidator } from './url';
import type { StrapiSDKConfig } from '../sdk';
/**
 * Provides the ability to validate the configuration used for initializing the Strapi SDK.
 *
 * This includes URL validation to ensure compatibility with Strapi's API endpoints.
 */
export declare class StrapiSDKValidator {
    private readonly _urlValidator;
    constructor(urlValidator?: URLValidator);
    /**
     * Validates the provided SDK configuration, ensuring that all values are
     * suitable for the SDK operations..
     *
     * @param config - The configuration object for the Strapi SDK. Must include a `baseURL` property indicating the API's endpoint.
     *
     * @throws {StrapiSDKValidationError} If the configuration is invalid, or if the baseURL is invalid.
     */
    validateConfig(config: StrapiSDKConfig): void;
    /**
     * Validates the base URL, ensuring it follows acceptable protocols and structure for reliable API interaction.
     *
     * @param url - The base URL string to validate.
     *
     * @throws {StrapiSDKValidationError} If the URL is invalid or if it fails through the URLValidator checks.
     */
    private validateBaseURL;
}

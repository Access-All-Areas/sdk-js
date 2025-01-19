import { AbstractAuthProvider } from './abstract';
/**
 * Configuration options for API token authentication.
 */
export interface ApiTokenAuthProviderOptions {
    /**
     * This is the Strapi API token used for authenticating requests.
     *
     * It should be a non-empty string
     */
    token: string;
}
export declare class ApiTokenAuthProvider extends AbstractAuthProvider<ApiTokenAuthProviderOptions> {
    static readonly identifier = "api-token";
    constructor(options: ApiTokenAuthProviderOptions);
    get name(): string;
    private get token();
    preflightValidation(): void;
    authenticate(): Promise<void>;
    get headers(): {
        Authorization: string;
    };
}

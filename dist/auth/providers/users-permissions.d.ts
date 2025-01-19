import { HttpClient } from '../../http';
import { AbstractAuthProvider } from './abstract';
/**
 * Configuration options for Users & Permissions authentication.
 */
export interface UsersPermissionsAuthProviderOptions {
    /**
     * The unique user identifier used for authentication.
     */
    identifier: string;
    /**
     * The secret passphrase associated with the user's identifier
     */
    password: string;
}
/**
 * Payload required for the Users & Permissions authentication process.
 */
export type UsersPermissionsAuthPayload = Pick<UsersPermissionsAuthProviderOptions, 'identifier' | 'password'>;
/**
 * @experimental
 * Authentication through users and permissions is experimental for the MVP of
 * the Strapi SDK.
 */
export declare class UsersPermissionsAuthProvider extends AbstractAuthProvider<UsersPermissionsAuthProviderOptions> {
    static readonly identifier = "users-permissions";
    private _token;
    constructor(options: UsersPermissionsAuthProviderOptions);
    get name(): string;
    private get credentials();
    preflightValidation(): void;
    get headers(): Record<string, string>;
    authenticate(httpClient: HttpClient): Promise<void>;
}

import { CollectionTypeManager, SingleTypeManager } from './content-types';
export interface StrapiSDKConfig {
    baseURL: string;
    auth?: AuthConfig;
}
export interface AuthConfig<T = unknown> {
    strategy: string;
    options: T;
}
/**
 * Class representing the Strapi SDK to interface with a Strapi backend.
 *
 * This class integrates setting up configuration, validation, and handling
 * HTTP requests with authentication.
 *
 * It serves as the main interface through which users interact with
 * their Strapi installation programmatically.
 *
 * @template T_Config - Configuration type inferred from the user-provided SDK configuration
 */
export declare class StrapiSDK<const T_Config extends StrapiSDKConfig = StrapiSDKConfig> {
    /**
     * Retrieves the base URL of the Strapi SDK instance.
     *
     * This getter returns the `baseURL` property stored within the SDK's configuration object.
     *
     * The base URL is used as the starting point for all HTTP requests initiated through the SDK.
     *
     * @returns The current base URL configured in the SDK.
     *          This URL typically represents the root endpoint of the Strapi service the SDK interfaces with.
     *
     * @example
     * const config = { baseURL: 'http://localhost:1337/api' };
     * const sdk = new StrapiSDK(config);
     *
     * console.log(sdk.baseURL); // Output: http://localhost:1337
     */
    get baseURL(): string;
    /**
     * Executes an HTTP fetch request to a specified endpoint using the SDK HTTP client.
     *
     * This method ensures authentication is handled before issuing requests and sets the necessary headers.
     *
     * @param url - The endpoint to fetch from, appended to the base URL of the SDK.
     * @param [init] - Optional initialization options for the request, such as headers or method type.
     *
     * @example
     * ```typescript
     * // Create the SDK instance
     * const sdk = strapiSDK({ baseURL: 'http://localhost:1337/api' );
     *
     * // Perform a custom fetch query
     * const response = await sdk.fetch('/categories');
     *
     * // Parse the categories into a readable JSON object
     * const categories = await response.json();
     *
     * // Log the categories
     * console.log(categories);
     * ```
     *
     * @note
     * - The method automatically handles authentication by checking if the user is authenticated and attempts to authenticate if not.
     * - The base URL is prepended to the provided endpoint path.
     */
    fetch(url: string, init?: RequestInit): Promise<Response>;
    /**
     * Returns a {@link CollectionTypeManager} instance to interact with the specified collection-type routes in the
     * Strapi app.
     *
     * This instance provides methods for performing operations on the associated documents: create, read, update, delete.
     *
     * @param resource -  The plural name of the collection to interact with.
     *                    This should match the collection name as defined in the Strapi app.
     *
     * @returns An instance of {@link CollectionTypeManager} targeting the given {@link resource} name.
     *
     * @example
     * ```typescript
     * // Initialize the SDK with required configuration
     * const sdk = new StrapiSDK({ baseURL: 'http://localhost:1337/api' });
     *
     * // Retrieve a CollectionTypeManager for the 'articles' resource
     * const articles = sdk.collection('articles');
     *
     * // Example: find all articles
     * const allArticles = await articles.find();
     *
     * // Example: find a single article by ID
     * const singleArticle = await articles.findOne('936c6dc0-f2ec-46c3-ac6d-c0f2ec46c396');
     *
     * // Example: create a new article
     * const newArticle = await articles.create({ title: 'New Article' });
     *
     * // Example: update an existing article
     * const updatedArticle = await articles.update('90169631-7033-4963-9696-317033a96341', { title: 'Updated Title' });
     *
     * // Example: delete an article
     * await articles.delete('dde61ffb-00a6-4cc7-a61f-fb00a63cc740');
     * ```
     *
     * @see CollectionTypeManager
     * @see StrapiSDK
     */
    collection(resource: string): CollectionTypeManager;
    /**
     * Returns a {@link SingleTypeManager} instance to interact with the specified single-type routes in the Strapi app.
     *
     * This instance provides methods for managing the associated single-type document: read, update, delete.
     *
     * @param resource - The singular name of the single-type resource to interact with.
     *                   This should match the single-type name as defined in the Strapi app.
     *
     * @returns An instance of {@link SingleTypeManager} targeting the given {@link resource} name.
     *
     * @example
     * ```typescript
     * // Initialize the SDK with required configuration
     * const sdk = new StrapiSDK({ baseURL: 'http://localhost:1337/api' });
     *
     * // Retrieve a SingleTypeManager for the 'homepage' resource
     * const homepage = sdk.single('homepage');
     *
     * // Example: fetch the homepage content in Spanish
     * const homepageContent = await homepage.find({ locale: 'es' });
     *
     * // Example: update the homepage content
     * const updatedHomepage = await homepage.update({ title: 'Updated Homepage Title' });
     *
     * // Example: delete the homepage content
     * await homepage.delete();
     * ```
     *
     * @see SingleTypeManager
     * @see StrapiSDK
     */
    single(resource: string): SingleTypeManager;
}

/**
 * @author Luke Brandon Farrell
 * @description Middleware used for persisting redux state.
 */
export declare type SaveCallback = (key: string, state: object) => void;
export declare type LoadCallback = (key: string) => object;
/**
 * Middleware to load persisted state data
 *
 * @param save - Async function used to save the state to the storage
 * @param load - Async function used to load the state from the storage
 *
 * @return {function(*): function(*=): *}
 */
export declare const persistMiddleware: (save: SaveCallback, load: LoadCallback) => (next: any) => (action: any) => Promise<any>;
/**
 * Persist Tree - Method to persist state data
 *
 * @param structure - The Structure describes the parts of the state we want
 * to persist.
 * @param store - Redux Store
 * @param debug - Debug data to the console
 *
 */
export declare function persistTree(structure: any, store: any, debug: boolean): void;

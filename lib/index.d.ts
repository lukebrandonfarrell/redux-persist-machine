/**
 * @author Luke Brandon Farrell
 * @description Middleware used for persisting redux state.
 */
export declare type SaveCallback = (key: string, state: object) => void;
export declare type LoadCallback = (key: string) => Promise<object>;
/**
 * Middleware to load persisted state data
 *
 * @param save - Async function used to save the state to the storage
 * @param load - Async function used to load the state from the storage
 *
 * @return {function(*): function(*=): *}
 */
declare function persistMiddleware(): (next: any) => (action: any) => Promise<any>;
declare namespace persistMiddleware {
    let run: (store: any) => void;
}
/**
 * Persist Tree - Method to persist state data
 *
 * @param structure - The Structure describes the parts of the state we want
 * to persist.
 * @param store - Redux Store
 * @param debug - Debug data to the console
 */
export declare function createPersistMachine(structure: any, save: SaveCallback, load: LoadCallback, debug: boolean): typeof persistMiddleware;
/**
 * Builds a action type.
 * e.g. transforms "data.adminAuth" into @ReduxPM/LoadDataAdminAuth
 *
 * @param {string} key the key to generate the action name
 */
export declare function getPersistMachineAction(key: string): string;
export {};

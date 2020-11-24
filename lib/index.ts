/**
 * @author Luke Brandon Farrell
 * @description Middleware used for persisting redux state.
 */

import _pickBy from "lodash/pickBy";
import _map from "lodash/map";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _startCase from "lodash/startCase";
import _isEqual from "lodash/isEqual";

export type SaveCallback = (key: string, state: object) => void;
export type LoadCallback = (key: string) => object;

/**
 * Keeps track of the current values of the state.
 *
 * @type {Array}
 */
let currentValue: Array<any> = [];

/**
 * Stores our save method
 *
 * @type {func}
 */
let saveMethod : SaveCallback;

/**
 * Stores our load method
 *
 * @type {func}
 */
let loadMethod : LoadCallback;

/**
 * Middleware to load persisted state data
 *
 * @param save - Async function used to save the state to the storage
 * @param load - Async function used to load the state from the storage
 *
 * @return {function(*): function(*=): *}
 */
export const persistMiddleware = (save: SaveCallback, load: LoadCallback) => (next : any) => async (action : any) => {
    // Assign our save and load methods
    saveMethod = save;
    loadMethod = load;
    // Gets the our trigger actions
    const currentValueActionAndKeys : Array<any> = Object.entries(currentValue)
        .map((item : any) => { return { action: item[1].action, key: item[1].key }});
    const targetActionAndKey : any = currentValueActionAndKeys.filter(item => (item.action === action.type))[0];

    // Only run this code for our defined load actions
    if (!_isNil(targetActionAndKey)) {
        const { key: asyncStorageKey } = targetActionAndKey;

        // If target is nil, then no need to attempt to load from async storage
        if(!_isNil(asyncStorageKey)) {
            // Invoke our load function on the target key
            let payload = await load(asyncStorageKey);

            // Merge the payload received from our load function
            action.payload = { ...payload, ...action.payload };

            // Update our current value target to isLoaded = true
            currentValue[asyncStorageKey] = {
                ..._get(currentValue, asyncStorageKey, {}),
                isLoaded: true
            };
        } else {
            action.payload = { ...action.payload };
        }
    }

    return next(action);
};

/**
 * Persist Tree - Method to persist state data
 *
 * @param structure - The Structure describes the parts of the state we want
 * to persist.
 * @param store - Redux Store
 * @param debug - Debug data to the console
 *
 */
export function createPersistMachine(structure : any, store : any, debug: boolean) {
    /*
     * We do an initial map of the structure
     */
    _map(structure, (object : any, name : any) => {
        // Catch any errors with the persist configuration
        if(_isNil(object.key)) throw new Error("You need to define a `key` value to identify your data in your persist object.");

        // Get the static key for mapping
        const { key: asyncStorageKey } = object;
        // Builds the type from the reducer name, if a type has not been explicitly defined through the `action` value
        const action = object.action || buildAction(name);

        // Initialize and empty currentValue, this is used to keep track of previous values
        currentValue[asyncStorageKey] = {
            ..._get(currentValue, name, {}),
            key: asyncStorageKey,
            action,
            isLoaded: false
        };
    });

    /**
     * Handles state changes
     *
     * Saves the state values defined in structure when thats
     * slice of the state is updated.
     */
    async function handleChange() {
        /*
         * We map the structure to support multiple
         * reducers. The `object` contains the keys that are
         * declared to be saved. The `name` is the key for
         * that reducer.
         */
        await _map(structure, async (object : any, name : any) => {
            // A key to keep the state mapping static
            const { key: asyncStorageKey } = object;
            // Get the state values we want to map.
            const stateValues = object.values;
            // Get the object we want from the currentValue
            const currentValueObject = currentValue[asyncStorageKey];
            // Gets the current state
            const state = select(store.getState(), name);
            // Gets the previous state
            const previousValue = _get(currentValueObject, "state", null);

            /*
             * Builds a state only containing the values
             * we care about, which are defined in structure.
             */
            const newState = _pickBy(state, (value : any, key : any) => {
                /**
                 * If nothing is passed to the `values`
                 * parameter, all values will be used.
                 */
                if (_isNil(stateValues)) return value;
                
                if (stateValues.includes(key)) return value;
            });

            // Merges our newState object into our currentValues by key
            currentValue[asyncStorageKey] = {
                ..._get(currentValue, asyncStorageKey, {}),
                key: asyncStorageKey,
                state: newState,
            };

            if (!_isEqual(previousValue, newState)) {
                /*
                 * Each reducers value will have an `isLoaded` property, this
                 * allows us to keep track on a individual level
                 * if the reducer has been loaded. We don't want to
                 * save the reducer if it has not been loaded yet.
                 */
                if (currentValue[asyncStorageKey].isLoaded) {
                    if(debug) console.log(`SAVED: ${asyncStorageKey}`, newState);

                    await saveMethod(asyncStorageKey, newState);
                }
            }
        });
    }

    /*
     * Note that the .subscribe function returns a unsubscribe method if we
     * ever need to unsubscribe from state updates.
     */
    store.subscribe(handleChange);

    // If debug, we to log all the actions for loading the state
    if(debug) {
        _map(structure, async (object : any, name : any) => {
            console.log(object.action || buildAction(name));
        });
    }
}

/**
 * Selects our nested property
 *
 * @param state
 * @param key
 *
 * @return {*}
 */
function select(state : any, key : any) : object {
    return _get(state, key, {});
}


/**
 * Builds a action type e.g. transforms "data.adminAuth" into LOAD_DATA_ADMIN_AUTH
 *
 * @param key
 * @return {string}
 */
function buildAction(key : string){
    return`LOAD_${ _startCase(key).split(" ").join("_").toUpperCase()}`; // We build the type from the target (reducer name)
}
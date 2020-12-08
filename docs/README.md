## Install

Install with npm:
```
 npm install redux-persist-machine
```

## Usage

Import with:

```js
import { createPersistMachine } from "redux-persist-machine";
```

### Setup

There are a couple of things you need to get started. Firstly add the return of `createPersistMiddleware` to your redux middleware.

The `createPersistMiddleware()` parameters are:
- the structure of your store and use arrays to define what values you want the middleware to persist
- a save method
- a load method
- (optional) whether to enable debug or not

The structure of your store consist of an object that takes some objects, and each object has to follow the following schema:

- The key of each value in the persist object should match your store shape, a nested reducer would be defined as such: `data.device`.
- In the `values` key, you can customize which values the package will keep track of. If nothing is provided to the `values` field, all fields will be saved.
- A `key` is required to be defined for each persisted reducer, this will be used as the async storage key, it keeps a static map of your data which is independent of its shape, which is useful as your application grows.
- An optional key of `action` can be defined to explicitly declare which action type should trigger a load of that reducer, without this value each load type is generated automatically from the state shape. e.g. to load `"data.device"` fire `@ReduxPM/LoadDataDevice`, to load `"subscriptionOrders"` fire  `@ReduxPM/LoadSubscriptionOrders`.
- An optional `automatic` key can also be provided to specify if that reducer should be loaded automatically, without having to dispatch the action. It defaults to `true`.

For the load and save method, you don't have to write them by yourself, they are [available as separate packages below](#providers).

```js
// e.g. save and load methods -> available as separate packages below
const saveState = (key, state) => ...
const loadState = (key) => ...

  /**
    You define the structure that you want to save
    in this object, and then pass it as an argument.
    Instructions on how to create this object are above.
  */
const structure = {
  orders: {
    values: ["data", "updatedAt", "index"],
    key: "@key-orders",
    automatic: false
  },
  auth: {
    values: [
      "id",
      "name",
      "email",
      "birthday",
      "gender",
    ],
    key: "@key-auth",
  },
  "data.device": {
    values: [
     "id",
     "token",
    ],
    action: "LOAD_DEVICE", // custom action name
    key: "@key-device"
  }
};

// store.js

const persistMiddleware = createPersistMiddleware(
  structure, saveState, loadState
)
const middleware = [persistMiddleware];

export const store = createStore(
  reducers,
  applyMiddleware(...middleware)
);
```

Your reducer data will automatically saved when the values are changed. You can load each reducer using its load action (to see all the load actions generated in your console set the fourth parameter of `createPersistMachine` to `true`).

After setting the middleware in the store, you need to call `createPersistMachine.run` and pass the store as an argument.

```js
createPersistMachine.run(store)
```

### Loading Data

You can receive actions in your reducers. The code below will apply the saved state to your current state:

```js
case "@ReduxPM/LoadSubscriptionOrders": {
    return {
        ...state,
        ...action.payload,
    }
}
```

This allows you to have loading on a per reducer basis separated across the application for stored data instead of having the full application wait for the data to be loaded.

The middleware runs: `action.payload = { ...storedData, ...action.payload };` to add the saved data to the payload when the `@ReduxPM/LoadActions` is triggered. You can also pass additional data in your payload to add context to your `@ReduxPM/LoadActions` for complex conditional consummation of the loaded data in your reducers.

## Providers

Links for save and load functions for diffrent libraries and platforms.

- [redux-persist-machine-async-storage](https://github.com/lukebrandonfarrell/redux-persist-machine-async-storage)
- [redux-persist-machine-local-storage](https://github.com/aspect-apps/redux-persist-machine-local-storage)

## Install

Install with npm:
```
 npm install redux-persist-tree --save
```
## Usage

Import with:

```js
import { persistMiddleware, persistTree } from "redux-persist-tree";
```

### Setup

There are a couple of things you need to get started. Firstly add the `persistMiddleware` to your redux middleware.

The middleware parameters are a save and load method, you don't have to write these yourself, they are [available as separate packages below](#providers).

```js
// e.g. save and load methods -> available as separate packages below
const saveState = (key, state) => ...
const loadState = (key) => ...

// store.js

const middleware = [
  () => persistMiddleware(saveState, loadState)
];

export const store = createStore(
  reducers,
  applyMiddleware(...middleware)
);
```

The next step is to define the structure of your store and use arrays to define what values you want the middleware to persist.

```js
const persistThisData = {
  orders: {
    values: ["data", "updatedAt", "index"],
    key: "@key-orders",
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
    action: "LOAD_DEVICE",
    key: "@key-device"
  }
};

// Run this to start persisting data!
persistMachine(persistThisData, store, true);

```

The `persistMachine` takes three arguments: the persist object defined above, the redux store, and an optional bool value to enable debugging (default : false).

- The key of each value in the persist object should match your store shape, a nested reducer would be defined as such: "data.device"
- A `key` is required to be defined for each persisted reducer, this will be used as the async storage key, it keeps a static map of your data which is independent of its shape, which is useful as your application grows.
- An optional key of `action` can be defined to explicitly declare which action type should trigger a load of that reducer, without this value each load type is generated automatically from the state shape. e.g. to load `"data.device"` fire `LOAD_DATA_DEVICE`, to load `"subscriptionOrders"` fire  `LOAD_SUBSCRIPTION_ORDERS`.

Your reducer data will automatically saved when the values are changed. You can load each reducer using its load action (to see all the load actions generated in your console set the third parameter of `persistMachine` to `true`).

### Loading Data

You can receive actions in your reducers. The code below will apply the saved state to your current state:

```js
case LOAD_SUBSCRIPTION_ORDERS: {
    return {
        ...state,
        ...action.payload,
    }
}
```

This allows you to have loading on a per reducer basis separated across the application for stored data instead of having the full application wait for the data to be loaded.

The middleware runs: `` action.payload = { ...storedData, ...action.payload };`` to add the saved data to the payload when the LOAD_ACTION is triggered. You can also pass additional data in your payload to add context to your LOAD_ACTIONS for complex conditional consummation of the loaded data in your reducers.

## Providers

Links for save and load functions for diffrent libraries and platforms.

- [react-native-redux-persist-tree](https://github.com/lukebrandonfarrell/react-native-redux-persist-tree/blob/master/index.js)

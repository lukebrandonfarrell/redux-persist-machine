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

Firstly add the return value of `createPersistMachine` to your redux middleware. Then after creating your store, run the `createPersistMachine().run` method.

```js
// e.g. save and load methods -> available as separate packages below
const saveState = (key, state) => ...
const loadState = (key) => ...

/**
* You define the structure that you want to save
* in this object, and then pass it as an argument.
* Instructions on how to create this object are bellow.
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

const persistMiddleware = createPersistMachine(
  structure, saveState, loadState
)
const middleware = [persistMiddleware];
const store = createStore(
  reducers,
  applyMiddleware(...middleware)
);

// After setting the middleware in the store, you need to call `.run` and pass the store as an argument.
persistMiddleware.run(store)
```

For the load and save method, you don't have to write them by yourself, they are [available as separate packages below](#providers).

Your reducer data will automatically save when the values are changed. You can load each reducer using its load action (to see all the load actions generated in your console set the fourth parameter of `createPersistMachine` to `true`).


### Loading Data

You can receive actions in your reducers.

This allows you to have loading on a per reducer basis separated across the application for stored data instead of having the full application wait for the data to be loaded.

The package exports a function that makes it easier for you to set up a case in the reducer, by generating an action name that matches the one that the package uses under the hood.

The code below will apply the saved state to your current state:

```js
import { getPersistMachineAction } from 'redux-persist-machine'

case getPersistMachineAction("load.subscriptionOrders"): {
  return {
    ...state,
        ...action.payload,
    }
}
```

Of course, you can also define your own custom action name. This custom action name has to be passed oon the `action` property of the reducer in the structure object.

The middleware runs: `action.payload = { ...storedData, ...action.payload };` to add the saved data to the payload when the `@ReduxPM/LoadActions` is triggered. You can also pass additional data in your payload to add context to your `@ReduxPM/LoadActions` for complex conditional consummation of the loaded data in your reducers.

### Example Project

There's also an example project that shows `redux-persist-machine` in a real-app alongside with our other package, `redux-nl`. It has multiple reducers that are saved automatically.

[Check the example project!](https://github.com/aspect-apps/redux-nl-example)

## API Reference

### `createPersistMachine(structure, saveState, loadState)`

Creates a Redux persist middleware with your store structure.

- `structure: Object` - An object to define how you want to load your reducer values. The key of each value in the persist object should match your store shape, a nested reducer would be defined as such: `data.device`. Currently supported options are:
    - `values : Array` you can customize which values the package will keep track of. If nothing is provided to the `values` field, all fields will be saved.
    - `key : string` this will be used as the storage key, it keeps a static map of your data which is independent of its shape, which is useful if your reducers change their structure or name.
    - `action : string` defined to explicitly declare which action type should trigger a load of that reducer, without this value each load type is generated automatically from the state shape. e.g. to load `"data.device"` fire `LOAD_SUBSCRIPTION_ORDERS`.
    - `automatic : boolean` to specify if that reducer should be loaded automatically, without having to dispatch the action. It defaults to `true`.
- `saveState : Function` - a save function with the following signature `(key, state) => void`
- `loadState : Function` - a load function with the following signature `(key) => Object`
- `debug : booolean` - whether to enable debug mode or not (optional)

### `createPersistMachine(structure, saveState, loadState).run(store)`

- `store :` [Store](https://redux.js.org/api/store) - the redux store.

Starts the persist middleware. You should run this immediately after creating your store.

```js
const persistMiddleware = createPersistMachine(structure, saveState, loadState)
persistMiddleware.run(store)
```

### `getPersistMachineAction(actionKey)`

Generates an action name based on the provided key. You can use this function to set the case in your reducer to handle the data loading.

```js
case getPersistMachineAction("load.user.orders"): {
    return {
        ...state,
        ...action.payload,
    }
}
```

The example above would return `@ReduxPM/LoadUserOrders`.

## Providers

Links for save and load functions for diffrent libraries and platforms.

- [redux-persist-machine-async-storage](https://github.com/lukebrandonfarrell/redux-persist-machine-async-storage)
- [redux-persist-machine-local-storage](https://github.com/aspect-apps/redux-persist-machine-local-storage)

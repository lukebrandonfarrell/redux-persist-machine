## Use Cases

#### Split Data

In a production application the reducer which handles authentication was split into two reducers `auth` and `subscription`. To avoid all the users being authenticated without a subscription when the application was updated... it was possible to rehydrate the subscription data into it's new reducer using redux-persist-tree.

```js

// SubscriptionReducer.js

case LOAD_AUTH: {
    /*
    * We use this to catch people upgrading from older versions of the app,
    * as auth and subscriptions were joint together.
    */
    if (_has(action, "payload.subscription")) {
      return {
        ...state,
        ...action.payload.subscription
      };
    }

    return state;
}
```
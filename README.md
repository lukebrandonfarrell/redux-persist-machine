<p align="center">
  <img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/redux-persist-machine/redux-persist-machine-logo.png" width="240" height="240">
  <br />
  <a href="https://www.npmjs.com/package/redux-persist-machine" rel="nofollow">
    <img src="https://img.shields.io/npm/v/redux-persist-machine.svg?style=flat-square" alt="version" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/redux-persist-machine" rel="nofollow">
    <img src="http://img.shields.io/npm/l/redux-persist-machine.svg?style=flat-square" alt="license" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/redux-persist-machine" rel="nofollow">
    <img src="http://img.shields.io/npm/dt/redux-persist-machine.svg?style=flat-square" alt="downloads" style="max-width:100%;" />
  </a>

  <hr />
</p>

redux-persist-machine provides a reliable way to rehydrate your state. The state can be rehydrated on a per reducer basis at any time in your application lifecycle.

- Load data conditionally with LOAD actions (e.g. only load orders from storage if the request to fetch them fails)
- Don't allow shape changes in your store to affect your data (each stored reducer will have its own key and loaded data is reassigned manually in each reducer)
- Define how your reducers receive and persist loaded data, allowing further customisation on when and how data is rehydrated through your application.

[See our documentation](https://github.com/lukebrandonfarrell/redux-persist-machine/blob/master/docs/README.md).

## Motivation

#### Why not use redux-persist? 

[redux-persist](https://github.com/rt2zz/redux-persist) is a well written library, with support for many storage engines, and transformers which allow for complex use cases. 

redux-persist-machine gives you more control over how your data is loaded in your application; when your data is loaded, which data you want to save and load, and how your data is received / rehydrate by each reducer.

"From personal experience building many applications with redux and redux-saga I've found it's necessary to handle loaded data in your reducers in products with rapidly changing requirements to provide a reliable customer experience" -- Luke Brandon Farrell

There are many other options for persisting data, but if you want to provide an offline first experience, and control how your data is loaded into your application, then redux-persist-machine is the best option for you.

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT License

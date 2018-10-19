# Makes .babelrc file obsolete

more info: [https://github.com/facebook/jest/issues/1468](https://github.com/facebook/jest/issues/1468)

For those landing on this issue and wondering what scriptPreprocessor is
(it's since been removed), here is how I got jest to work with babel
without using .babelrc.

./jest.transform.js

// Custom Jest transform implementation that wraps babel-jest and injects our
// babel presets, so we don't have to use .babelrc.

  ```js
  module.exports = require('babel-jest').createTransformer({
    presets: ['node7', 'react', 'stage-2'], // or whatever
  });
  ```

./jest.config.js (or "jest" entry in package.json:

  ```js
  "transform": {
    "^.+\\.js$": "<rootDir>/jest.transform.js"
  },
  ```

Now run jest with these options:

jest --config jest.config.json --no-cache

The --no-cache option bit me hard - when you're messing with transforms, jest
will often skip your custom transformer entirely if it thinks it's already
transformed it. Once you have things working smoothly, you can drop --no-cache.

# WpeTestFramework

This is an experimental prototype / proof of concept for the **WpeTestFramework**, which will serve as a base for _v2_ of the testing framework.

The objective of this prototype is to design a _flexible_, _isomorphic_ test runner that can run test cases in both a node process and in a browser.

This will allow us to use the _same_ tests and the _same_ test runner in different environments and implementations.
For example: in web browser on a hosted website, as a packaged executable (e.g. Zeit/pkg or Electron app), as a local NodeJS cli, or in some kind of Continuous Integration solution.

## Work in Progress

This code is explicitely **Work in Progress**! It's a first version that is _not complete_ and _not final_ by any means.

Specifically missing at this point (but in the works):

- [x] Support for setting a `timeout` for a test / step
- [ ] Ability to run the test runner in a `web worker` (and not on the main thread), but report results back to the main process
- [ ] Various helper test methods
- [ ] Various helper validation methods
- [ ] Ability to `extend` a test

## How to use

To try out this prototype:

1. Clone this repository and checkout the `prototype` branch
2. Install the NPM dependencies by running `npm install` (or `yarn`)
3. Copy `config.example.js` to `config.js` and adjust the values to match your local environment (specifically `ip`, which refers to the IP-address of the Set-Top Box you want to run the tests against)
4. Run `npm run cli` (or `yarn cli`) to execute the test runner in CLI mode
5. Run `npm run browser` (or `yarn browser`) to fire up a local server and execute the test runner from a browser window
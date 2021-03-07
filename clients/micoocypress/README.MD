Micoo Cypress
--

This is a Cypress plugin for doing Visual Regression Testing with Micoo. For 
details about visual regression testing with Micoo, please check on the Micoo github 
[repository](https://github.com/Mikuu/Micoo) and Micoo [document](https://arxman.com/micoo/).

## Do you really need this plugin
Actually, this plugin is not mandatory for doing visual regression testing with Cypress 
and Micoo. You can use Cypress to test your UI application and take screenshots with 
`cy.screenshot()`. After that, use Node library `miooc` to trigger visual regression 
testing with those saved screenshots. More detailed instruction about Micoo client 
in NodeJS can be found [here](https://github.com/Mikuu/Micoo/tree/master/clients/nodejs).

## With this plugin
However, if you don't like taking visual regression testing depart from your Cypress tests, 
and hope to make everything in the same process of Cypress run, then this plugin would be 
handy for you.

## Use this plugin
Doing visual regression testing with Micoo is completely independent to Cypress tests, so there 
need no special cypress `commands` and steps, all you need is to import and use this plugin.

### install plugin
```commandline
npm install --save-dev micoocypress
```

### load plugin in Cypress
Follow below example to load plugin `micoocypress` in your Cypress tests. 
```javascript
// cypress/plugins/index.js

const micoocypress = require("./micoocypress");

const micooption = {
  host: "http://localhost:8123/engine",
  apiKey: "AK98b56a53c5cbe67b9a",
  pid: "PID852d6b23c9894c7a8f9b67fbb75a5faa",
  buildVersion: process.env.MICOO_BUILD_VERSION ? process.env.MICOO_BUILD_VERSION : "misiing versioning",
}

module.exports = (on, config) => {
  micoocypress(on, micooption);
}
```

### enable `experimentalRunEvents` feature
To make this plugin working, it needs to enable an experimental Cypress feature `experimentalRunEvents` 
in your Cypress configuration file, e.g. `cypress.json`
```json
{
  "experimentalRunEvents": true
}
```

With all above setup, and given you already have a Micoo service up and running, it's ready to go 
Visual Regression Testing with Cypress and Micoo. For more details about how to use Micoo, please 
check its [document](https://arxman.com/micoo/).

## How this plugin works
Basically, this plugin is just a wrapper of `micooc` which is a Micoo client for NodeJS. Once 
you have prepared all the setup, bellow steps will happen in your Cypress tests:
- in your tests, when use `cy.screesnshot()`, a screenshot will be saved locally, this is Cypress 
  default behaviour,
- meanwhile, `micoocypress` copies each saved screenshot file to a folder `micoo-screenshots`,
- after all Cypress tests run completed, `micoocypress` uploads all the screenshots files to Micoo
service and trigger a new visual testing build.
  
## Usage of plugin `micoocypress`
when you load `micoocypress` in `cypress/plugin/index.js`, it accepts 2 configuration option 
parameters `micooption` and `cypressOption`, e.g.

```javascript
const micooption = {
  host: "http://localhost:8123/engine",
  apiKey: "AK98b56a53c5cbe67b9a",
  pid: "PID852d6b23c9894c7a8f9b67fbb75a5faa",
  buildVersion: process.env.MICOO_BUILD_VERSION ? process.env.MICOO_BUILD_VERSION : "misiing versioning",
}

const cypressOption = {
  triggerVisualTesting: true,
  triggerOnAllPassed: true,
  removeScreenshotsAfterUpload: true,
}

module.exports = (on, config) => {
  micoocypress(on, micooption, cypressOption);
}
```

there usages are like below:

### `micooption`, a mandatory object with attributes:
- `host`: string value. The Micoo's base URL plus /engine,
- `apiKey`: string value. The project's API Key, it could be found from the Micoo UI,
- `pid`: string value. Your Micoo project's PID, it can be found from the Micoo project page's URL,
- `buildVersion`: string value. This build version is neither parts of Micoo, nor your UI automation test, 
  it needs to be the version of you SUT application, most of the case, it's the git revision 
  number. buildVersion is a useful setup of mappings between your visual tests and the SUT 
  application. Anyway, technically, it's just a string which will be displayed in Micoo's 
  project board, you can use anything which is meaningful to you.

### `cypressOption`, an optional object with attributes:
- `triggerVisualTesting`: boolean value. Control whether to trigger visual regression testing, 
  if set it `false`, `micoocypress` will only collect all screenshots to `micoo-screenshots` folder 
  but not to upload them to Micoo service. Default value is `true`.
- `triggerOnAllPassed`: boolean value. By default, `micoocypress` will only trigger visual regression 
  testing when all Cypress tests are passed, you can change this control by setting `false` 
  to this attribute. Default value is `true`.
  > Please note that the screenshots automatically taken by Cypress for failed 
  tests will not be able to upload to Micoo service because they don't match the filename criteria from Micoo.
- `removeScreenshotsAfterUpload`: boolean value. By default, the `micoo-screenshots` folder will be 
deleted after triggered visual regression testing, set this attribute to `false` can keep the 
  screenshots there in case you need to investigate them before doing visual testing. Default 
  value is `true`.


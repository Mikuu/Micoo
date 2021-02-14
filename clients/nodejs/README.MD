Miccoc
--

The NodeJS client library for Micoo. This library provide below functions:
- newBuild
- buildStats
- latestBuildStats

## Installation
```commandline
npm install micooc
```

## newBuild
Upload screenshots to and trigger visual test build in Micoo.

### usage example:
```javascript
const { newBuild } = require("micooc");

async function testNewBuild() {
  const host = "http://localhost:8123/engine";
  const apiKey = "AK005fca5cbc9779755f";
  const pid = "PID6fb00c63d17f4596ba831a299edd21b4";
  const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
  const screenshotDirectory = "./screenshots";

  await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory);
}

testNewBuild();
```
### parameters
* `host` - the Micoo's base URL plus `/engine`,
* `apiKey` - the project's API Key, it could be found from the Micoo UI,
* `pid` - your Micoo project's PID, it can be found from the Micoo project page's URL,
* `buildVersion` - this build version is neither parts of Micoo, nor your UI automation test, it needs to be the version of you SUT application, most of the case, it's the git revision number. `buildVersion` is a useful setup of mappings between your visual tests and the SUT application. Anyway, technically, it's just a string which will be displayed in Micoo's project board, you can use anything which is meaningful to you.
* `screenshotDirectory` - the directory where contains all screenshots to be uploaded, only `.png` file will be uploaded. All the uploaded screenshot filename becomes the test case name, so there are some restriction to the filename, it must shorter than 100 letters and match [a-zA-Z0-9-_&()#].

### About `buildVersion`
`buildVersion` comes from the SUT application Version Control System, e.g. GIT, SVN, and they are probably differentiate from different test builds, especially when integrate the visual test in CI.

So, a more valid usage is to pass its value from environment variable, like this

```javascript
// visual-test.js
const { newBuild } = require("micooc");

async function testNewBuild() {
    const host = "http://localhost:3002";
    const apiKey = "AK005fca5cbc9779755f";
    const pid = "PID3755a497c3884b678183cd1603301a86";
    const buildVersion = process.env.buildVersion;
    const screenshotDirectory = "./latestScreenshot";

    await newBuild(host, apiKey, pid, buildVersion, screenshotDirectory);
}

testNewBuild();
```
and run this script with environment variable

```commandline
# use text build version
buildVersion=5fafc0478af24af2da45fa19ddd06c17dd5d0d45 node visual-test.js

# or, with Jenkins, you can use GIT_COMMIT
buildVersion=GIT_COMMIT node visual-test.js
```

## buildStats
Get the stats of a specific build

### usage example

```javascript
const { buildStats } = require("micooc");

async function testBuildStats() {
  const host = "http://localhost:8123";
  const apiKey = "AK005fca5cbc9779755f";
  const bid = "BID72df2bdcac5e49f7af22d41f8bc992c3";

  console.log(await buildStats(host, apiKey, bid));
}

testBuildStats();
```

### parameters

* `host` - the Micoo's base URL,
* `apiKey` - the project's API Key, it could be found from the Micoo UI,  
* `bid` - the Micoo build's bid, once you use `newBuild` to create a new build, its `bid` will be returned in the response.


## latestBuildStats
Get the stats of a project's latest build

### usage example

```javascript
const { latestBuildStats } = require("micooc");

async function testLatestBuildStats() {
  const host = "http://localhost:8123";
  const apiKey = "AK005fca5cbc9779755f";
  const pid = "PID6fb00c63d17f4596ba831a299edd21b4";

  console.log(await latestBuildStats(host, apiKey, pid));
}

testLatestBuildStats();
```
### parameters

* `host` - the Micoo's base URL,
* `apiKey` - the project's API Key, it could be found from the Micoo UI,  
* `pid` - the Micoo project's PID, it can be found from the Micoo project page's URL,

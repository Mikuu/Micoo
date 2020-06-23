Miccoc
--

The NodeJS client library for upload screenshots to and trigger visual test build in Micoo.

### Usage example:
```javascript
const { newBuild } = require("micooc");

function test() {
    const host = "http://localhost:3002";
    const pid = "PID3755a497c3884b678183cd1603301a86";
    const buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
    const screenshotDirectory = "./latestScreenshot";

    newBuild(host, pid, buildVersion, screenshotDirectory);
}

test();
```
### Parameters
* `host` - the Micoo's base URL plus `/engine`,
* `pid` - your Micoo project's PID, it can be found from the Micoo project page's URL,
* `buildVersion` - this build version is neither parts of Micoo, nor your UI automation test, it needs to be the version of you SUT application, most of the case, it's the git revision number. `buildVersion` is a useful setup of mappings between your visual tests and the SUT application. Anyway, technically, it's just a string which will be displayed in Micoo's project board, you can use anything which is meaningful to you.
* `screenshotDirectory` - the directory where contains all screenshots to be uploaded, only `.png` file will be uploaded.

### About `buildVersion`
`buildVersion` comes from the SUT application Version Control System, e.g. GIT, SVN, and they are probably differentiate from different test builds, especially when integrate the visual test in CI.

So, a more valid usage is to pass its value from environment variable, like this

```javascript
// visual-test.js
const { newBuild } = require("micooc");

function test() {
    const host = "http://localhost:3002";
    const pid = "PID3755a497c3884b678183cd1603301a86";
    const buildVersion = process.env.buildVersion;
    const screenshotDirectory = "./latestScreenshot";

    newBuild(host, pid, buildVersion, screenshotDirectory);
}

test();
```
and run this script with environment variable

```commandline
# use text build version
buildVersion=5fafc0478af24af2da45fa19ddd06c17dd5d0d45 node visual-test.js

# or, with Jenkins, you can use GIT_COMMIT
buildVersion=GIT_COMMIT node visual-test.js
```

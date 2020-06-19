Miccoc
--

The NodeJS client library for upload screenshots to and trigger visual test build in Micoo.

Usage example:
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

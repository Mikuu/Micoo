Miccoc
--

The Java client library for Micoo. This library provides below static functions:
- newBuild
- getBuildStats
- getLatestBuildStats

## Installation
you can find the latest dependency from Maven central [here](https://search.maven.org/artifact/com.github.mikuu/micooc)

## newBuild
Upload SUT screenshots to Micoo to trigger visual testing. New build will only be created when there is at least one screenshot has been successfully uploaded.

### usage example:
```java
import micooc.Micooc;
import micooc.model.InitializedBuild;

String serviceHost = "http://localhost:8123";
String apiKey = "AK005fca5cbc9779755f";
String pid = "PIDa9aa03c236a7426cb696e795f43e81f3";
String buildVersion = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45";
String screenshotDirectory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest";
String serviceEngineUrl = serviceHost + "/engine";

InitializedBuild initializedBuild = Micooc.newBuild(serviceEngineUrl, apiKey, pid, buildVersion, screenshotDirectory);
```
### parameters
- `host` - the host for Micoo service. When Micoo backend services are launched with docker, this shot should be the service IP or hostname plus path /engine, e.g. http://localhost:8123/engine. When Micoo backend services are launched separately, e.g. launched from local source code, this host should be the engine service's host, e.g. http://localhost:3002. 
- `apiKey` - the project's API Key, it could be found from the Micoo UI.
- `pid` - the PID of the target project in Micoo, e.g. PIDa9aa03c236a7426cb696e795f43e81f3.
- `buildVersion` - the build version of the current new build, usually it could be a git revision or svn version number.
- `screenshotsDirectory` - the directory path which contains the screenshots to upload to Micoo. Only .png files are valid, and filename should match [a-zA-Z0-9\-_&()#]+.png.

#### About `buildVersion`
`buildVersion` comes from the SUT application Version Control System, e.g. GIT, SVN, and they are probably differentiate from different test builds, especially when integrate the visual test in CI.

## getBuildStats
Get a specific build's test stats.

### usage example
```java
import micooc.Micooc;
import micooc.model.BuildStats;

String serviceHost = "http://localhost:8123";
String apiKey = "AK005fca5cbc9779755f";
String bid = "BID699d387482b743d1b7ceee907d5e3628";

BuildStats buildStats = Micooc.getBuildStats(serviceHost, apiKey, bid);
```

### parameters
- `host` - the host for Micoo service. This is always the Micoo dashboard service IP or hostname, e.g. http://localhost:8123.
- `apiKey` - the project's API Key, it could be found from the Micoo UI.
- `bid` - the bid of the build to fetch its testing stats, e.g. BID699d387482b743d1b7ceee907d5e3628


## getLatestBuildStats
Get testing stats of the latest build for a project in Micoo

### usage example

```java
import micooc.Micooc;
import micooc.model.LatestBuildStats;

String serviceHost = "http://localhost:8123";
String apiKey = "AK005fca5cbc9779755f";
String pid = "PIDa9aa03c236a7426cb696e795f43e81f3";

LatestBuildStats latestBuildStats = Micooc.getLatestBuildStats(serviceHost, apiKey, pid);
```

### parameters
- `host` - the host for Micoo service. This is always the Micoo dashboard service IP or hostname, e.g. http://localhost:8123.
- `apiKey` - the project's API Key, it could be found from the Micoo UI.
- `pid` - the bid of the project in Micoo, e.g. PIDa9aa03c236a7426cb696e795f43e81f3

## Javadoc
for more details please reference the [javadoc](https://www.javadoc.io/doc/com.github.mikuu/micooc/latest/micooc/Micooc.html)
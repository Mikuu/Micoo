Miccoc
---
The Python client library for Micoo. This library provide below functions:

- new_build
- build_stats
- latest_build_stats

## Installation
```commandline
pip install micooc
```

## new_build
Upload screenshots to and trigger visual test build in Micoo.
Return a dictionary of the new created build's bid and build_index.

### usage example:
```python
from micooc import new_build


def test_new_build():
    service_host = "http://localhost:8123"
    engine_host = service_host + "/engine"
    api_key = "AK005fca5cbc9779755f"
    pid = "PIDa8e3c0a4444a4f1a90a4dad8bd3467c2"

    build_version = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45"
    screenshot_directory = "./screenshots"

    return new_build(engine_host, api_key, pid, build_version, screenshot_directory)

# e.g. {'pid': 'PIDa8e3c0a4444a4f1a90a4dad8bd3467c2', 'bid': 'BID6fb9951c512c478aa891e1ce3e73ecca', 'build_index': 22}
test_new_build() 
```

### parameters
* `host` - the Micoo's base URL plus `/engine`,
* `api_key` - the project's API Key, it could be found from the Micoo UI,
* `pid` - your Micoo project's PID, it can be found from the Micoo project page's URL,
* `build_version` - this build version is neither parts of Micoo, nor your UI automation test, it needs to be the version of you SUT application, most of the case, it's the git revision number. `buildVersion` is a useful setup of mappings between your visual tests and the SUT application. Anyway, technically, it's just a string which will be displayed in Micoo's project board, you can use anything which is meaningful to you.
* `screenshot_directory` - the directory where contains all screenshots to be uploaded, only `.png` file will be uploaded. All the uploaded screenshot filename becomes the test case name, so there are some restriction to the filename, it must shorter than 100 letters and match [a-zA-Z0-9-_&()#].

### About `build_version`
`build_version` comes from the SUT application Version Control System, e.g. GIT, SVN, and they are probably differentiate from different test builds, especially when integrate the visual test in CI, so, a more valid usage is to pass its value from environment variable

## build_stats
Get the stats of a specific build.
Return a dictionary of the specific build's status and result.

### usage example

```python
from micooc import build_stats


def test_build_stats():
    service_host = "http://localhost:8123"
    api_key = "AK005fca5cbc9779755f"
    bid = "BIDfb1c90b110124e10a280d5ac5fc9cd20"

    build_stats(service_host, api_key, bid)

# e.g. {'status': 'completed', 'result': 'passed'}
test_build_stats()
```

### parameters

* `host` - the Micoo's base URL,
* `api_key` - the project's API Key, it could be found from the Micoo UI,  
* `bid` - the Micoo build's bid, once you use `new_build` to create a new build, its `bid` will be returned in the response.


## latest_build_status
Get the stats of a project's latest build.
Return a dictionary of the latest build's bid, index, status and result.

### usage example

```python
from micooc import latest_build_stats


def test_latest_build_stats():
    service_host = "http://localhost:8123"
    api_key = "AK005fca5cbc9779755f"
    pid = "PIDa8e3c0a4444a4f1a90a4dad8bd3467c2"

    return latest_build_stats(service_host, api_key, pid)

# e.g. {'bid': 'BID6fb9951c512c478aa891e1ce3e73ecca', 'index': 22, 'status': 'processing', 'result': 'undetermined'}
test_latest_build_stats()
```
### parameters

* `host` - the Micoo's base URL,
* `api_key` - the project's API Key, it could be found from the Micoo UI,  
* `pid` - the Micoo project's PID, it can be found from the Micoo project page's URL,

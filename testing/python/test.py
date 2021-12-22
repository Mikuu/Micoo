from micooc import new_build, build_stats, latest_build_stats

def test_new_build():
    service_host = "http://localhost:8123"
    engine_host = service_host + "/engine"
#     engine_host = "http://localhost:3002"
    api_key = "AKfeee37157323da4f60"
    pid = "PID74651dd2ca024cadb3b3338a9c2feaea"

    build_version = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45"
    screenshot_directory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest"

    return new_build(engine_host, api_key, pid, build_version, screenshot_directory)


def test_build_stats():
    service_host = "http://localhost:8123"
    api_key = "AKfeee37157323da4f60"
    bid = "BID707ac2c98b93419f9081c4c13bd19e07"

    return build_stats(service_host, api_key, bid)


def test_latest_build_stats():
    service_host = "http://localhost:8123"
    api_key = "AKfeee37157323da4f60"
    pid = "PID74651dd2ca024cadb3b3338a9c2feaea"

    return latest_build_stats(service_host, api_key, pid)


if __name__ == "__main__":
    response = test_new_build()
    print(response)

#     response = test_build_stats()
#     print(response)
#
#     response = test_latest_build_stats()
#     print(response)

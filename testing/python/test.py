from micooc import new_build, build_stats, latest_build_stats


def test_new_build():
    service_host = "http://localhost:8123"
    engine_host = service_host + "/engine"
    pid = "PIDa8e3c0a4444a4f1a90a4dad8bd3467c2"

    build_version = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45"
    screenshot_directory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest"

    return new_build(engine_host, pid, build_version, screenshot_directory)


def test_build_stats():
    service_host = "http://localhost:8123"
    bid = "BIDfb1c90b110124e10a280d5ac5fc9cd20"

    return build_stats(service_host, bid)


def test_latest_build_stats():
    service_host = "http://localhost:8123"
    pid = "PIDa8e3c0a4444a4f1a90a4dad8bd3467c2"

    return latest_build_stats(service_host, pid)


if __name__ == "__main__":
    response = test_new_build()
    print(response)

    response = test_build_stats()
    print(response)

    response = test_latest_build_stats()
    print(response)

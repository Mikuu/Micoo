import requests, re
from os import listdir
from os.path import isfile, join
from pathlib import PurePath


def valid_filename(screenshot_path):
    if re.match("^[a-zA-Z0-9\-_&()#]+$", PurePath(screenshot_path).stem):
        return True

    print("filename '{}' is unacceptable, support filename as [a-zA-Z0-9\-_&()#]+.png".format(
        PurePath(screenshot_path).name))
    return False


def valid_filename_length(screenshot_path):
    filename = PurePath(screenshot_path).name
    if len(filename) <= 100:
        return True

    print("filename '{}' length longer than 100".format(filename))
    return False


def valid_file_type(screenshot_path):
    suffix = PurePath(screenshot_path).suffix
    if suffix == ".png":
        return True

    print("file type '{}' not supported, only support png file".format(suffix))
    return False


def screenshot_filter(screenshot_path):
    if not isfile(screenshot_path):
        return False

    if not valid_filename(screenshot_path):
        return False

    if not valid_filename_length(screenshot_path):
        return False

    if not valid_file_type(screenshot_path):
        return False

    return True


def upload_valid_screenshot(upload_screenshot_url, screenshot_path):
    if screenshot_filter(screenshot_path):
        r = requests.post(upload_screenshot_url, files={"image": open(screenshot_path, "rb")})

        if r.status_code == requests.codes.ok:
            response = r.json()
            print("uploaded screenshot: {}".format(response["receivedImages"][0]))
            return 1
        else:
            print("upload screenshot '{}' failed with status code {}:".format(screenshot_path, r.status_code))
            print(r.text)
            return 0
    else:
        return 0


def upload_test_screenshots(upload_screenshot_url, screenshots_directory):
    uploaded_screenshots_count = 0
    for screenshot_path in listdir(screenshots_directory):
        uploaded_screenshots_count += upload_valid_screenshot(upload_screenshot_url,
                                                              join(screenshots_directory, screenshot_path))

    return uploaded_screenshots_count


def trigger_new_build(initialize_new_build_url, pid, build_version):
    r = requests.post(initialize_new_build_url, params={"pid": pid, "buildVersion": build_version})
    response = r.json()
    if r.status_code == requests.codes.ok:
        return {
            "pid": response["pid"],
            "bid": response["bid"],
            "build_index": response["buildIndex"]
        }
    else:
        print("initialize new build failed.")
        print(r.text)


def new_build(host, pid, build_version, screenshots_directory):
    upload_screenshot_url = host + "/slave/images/project-tests/{}".format(pid)
    initialize_new_build_url = host + "/slave/build/initialize"

    uploaded_screenshots_count = upload_test_screenshots(upload_screenshot_url, screenshots_directory)
    if uploaded_screenshots_count:
        return trigger_new_build(initialize_new_build_url, pid, build_version)
    else:
        print("No screenshot uploaded, no to initialize new build.")


def build_stats(host, bid):
    url = host + "/stats/build"
    r = requests.get(url, params={"bid": bid})

    if r.status_code == requests.codes.ok:
        response = r.json()
        return {"status": response["status"], "result": response["result"]}
    else:
        print("Get build stats failed")
        print(r.text)


def latest_build_stats(host, pid):
    url = host + "/stats/build/latest"
    r = requests.get(url, params={"pid": pid})

    if r.status_code == requests.codes.ok:
        response = r.json()
        return {
            "bid": response["bid"],
            "index": response["index"],
            "status": response["status"],
            "result": response["result"]
        }
    else:
        print("Get latest build stats failed")
        print(r.text)


if __name__ == "__main__":
    service_host = "http://localhost:8123"
    engine_host = service_host + "/engine"
    pid = "PIDa8e3c0a4444a4f1a90a4dad8bd3467c2"
    bid = "BIDfb1c90b110124e10a280d5ac5fc9cd20"

    build_version = "5fafc0478af24af2da45fa19ddd06c17dd5d0d45"
    screenshot_directory = "/Users/ariman/Workspace/Expressing/Micoo/testing/latest"

    response = new_build(engine_host, pid, build_version, screenshot_directory)
    print(response)

    response = build_stats(service_host, bid)
    print(response)

    response = latest_build_stats(service_host, pid)
    print(response)

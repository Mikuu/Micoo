#!/usr/bin/env bash
#########################################################################
# Build Local docker image with specific version.
# Usage:
#   e.g. ./build-image.sh -v 0.1.3
#
#########################################################################

while getopts v: flag
do
    # shellcheck disable=SC2220
    case "${flag}" in
        v) version=${OPTARG};;
    esac
done

if [[ -z "$version" ]]; then
  echo "missing version argument, e.g. -v 0.1.3"
else
  echo "building version: $version ..."
  docker build --rm -f ./Dockerfile --tag=micoo-dashboard:dev .
  docker image tag micoo-dashboard:dev micoo-dashboard:"$version"
  docker image tag micoo-dashboard:dev micoo-dashboard:latest
fi





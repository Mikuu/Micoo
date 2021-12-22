#!/usr/bin/env bash
################################################################################################
# Build Local docker image with specific version.
# Usage:
#   e.g.
#   ./build-image.sh               - only build image for tag 'dev'
#   ./build-image.sh -v 0.1.3      - build image for tag 'dev', 'latest' and '0.1.3'
#
################################################################################################

while getopts v: flag
do
    # shellcheck disable=SC2220
    case "${flag}" in
        v) version=${OPTARG};;
    esac
done

if [[ -z "$version" ]]; then
  echo "missing version argument, e.g. -v 0.1.3, only build dev image"
  docker build --no-cache --rm -f ./Dockerfile --tag=micoo-engine:dev .
else
  echo "building version: $version ..."
  docker build --no-cache --rm -f ./Dockerfile --tag=micoo-engine:dev .
  docker image tag micoo-engine:dev micoo-engine:"$version"
  docker image tag micoo-engine:dev micoo-engine:latest
fi
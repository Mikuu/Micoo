#!/usr/bin/env bash
#########################################################################
# Publish local docker image with specific version to docker hub.
# Usage:
#   e.g. ./publish-image.sh -v 0.1.3
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
  echo "publish version: $version ..."

  docker image tag micoo-engine:"$version" ariman/micoo-engine:"$version"
  docker image tag micoo-engine:latest ariman/micoo-engine:latest

  docker push ariman/micoo-engine:"$version"
  docker push ariman/micoo-engine:latest
fi

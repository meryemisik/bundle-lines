#!/bin/bash

docker buildx build \
  $(grep -v '^#' .env | xargs -I {} echo "--build-arg {}")\
  -t registry.digitalocean.com/bundlenews/bundle-lines:latest .

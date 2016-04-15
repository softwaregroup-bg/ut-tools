#!/bin/bash
re='([^/]*\/[^/]*)\.git$'
if [[ $CI_BUILD_REPO =~ $re ]]
then
  echo building ${BASH_REMATCH[1]}
  wget https://git.softwaregroup-bg.com/ut5/ut-tools/raw/master/gitlab/gitlab-ci.dockerfile && \
  docker build -t ${BASH_REMATCH[1]} -f gitlab-ci.dockerfile . && \
  docker run -i --rm ${BASH_REMATCH[1]} npm run gitlab
else
  echo invalid CI_BUILD_REPO $CI_BUILD_REPO
  exit 1
fi
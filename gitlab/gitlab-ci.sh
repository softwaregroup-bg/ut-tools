#!/bin/bash
re='([^/]*\/((impl-)|(ut-))([^/]*))\.git$'
if [[ $CI_BUILD_REPO =~ $re ]]
then
  echo building ${BASH_REMATCH[1]}
  wget https://git.softwaregroup-bg.com/ut5/ut-tools/raw/master/gitlab/gitlab-ci.dockerfile -O gitlab-ci.dockerfile && \
  docker build -t ${BASH_REMATCH[1]} -f gitlab-ci.dockerfile . && \
  docker run -i --rm -e CI_BUILD_ID -e UT_ENV -e UT_DB_PASS -e UT_MODULE=${BASH_REMATCH[5]} ${BASH_REMATCH[1]} npm run env && npm run gitlab
else
  echo invalid CI_BUILD_REPO $CI_BUILD_REPO
  exit 1
fi
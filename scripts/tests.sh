#!/usr/bin/env bash
. ./up_test_env.sh || return 1
sleep 2
cd ../backend || return 1
yarn test
cd ../scripts || return 1
. ./down_test_env.sh

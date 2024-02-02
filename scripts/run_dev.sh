#!/usr/bin/env bash

. ./up_dev_env.sh || return 0
cd ..
cp -n .env.dev .env
cd ./backend || return 0
yarn install
yarn run-migrations-and-start
cd cd ../scripts || return 0
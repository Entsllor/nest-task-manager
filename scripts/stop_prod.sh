#!/usr/bin/env bash

cd ..
docker compose -p prod down
echo "application has stopped"
cd - || return 0

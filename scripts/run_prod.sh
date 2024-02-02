#!/usr/bin/env bash

cd ..
cp -n .env.prod.example .env
docker compose -p prod up --build
echo "application has started in production mode"
cd - || return 0
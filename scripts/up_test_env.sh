#!/usr/bin/env bash
echo 'trying to up testing environment'
docker compose --env-file=../.env.test -p test -f ../docker-compose-env.yml up --build -d \
&& echo 'testing environment is upped'

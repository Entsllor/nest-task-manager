#!/usr/bin/env bash
echo 'trying to down testing environment'
docker compose --env-file=../.env.test -p test -f ../docker-compose-env.yml down -v
echo 'testing environment is downed'


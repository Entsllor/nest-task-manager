#!/usr/bin/env bash
echo 'trying to down dev environment'
docker compose --env-file=../.env -p dev -f ../docker-compose-env.yml down
echo 'dev environment is downed'

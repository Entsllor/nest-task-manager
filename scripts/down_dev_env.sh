#!/usr/bin/env bash
echo 'trying to down dev environment'
docker compose --env-file=../.env -p dev -f ../docker-compose-env.yaml down -v
echo 'dev environment is downed'

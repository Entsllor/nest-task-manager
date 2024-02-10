#!/usr/bin/env bash
docker compose \
  --env-file=../.env.test \
  -p test-in-docker \
  -f ../docker-compose-test.yml \
  up --build \
  --abort-on-container-exit --exit-code-from backend


docker compose \
  --env-file=../.env.test \
  -p test-in-docker \
  -f ../docker-compose-test.yml \
  down

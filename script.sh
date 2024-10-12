#!/bin/bash

# redis-server

echo "Waiting for Redis to start..."
until redis-cli ping | grep -q "PONG"; do
  echo "Waiting for Redis..."
  sleep 1
done

echo "Redis is ready!"

redis-cli ZADD leaderboard 0 'empty'

redis-cli SADD artists:leaderboard:voted "empty"

future_date=$(date +"%Y-%m-28")

unix_timestamp=$(date -d "$future_date" +"%s")

redis-cli SET artists:leaderboard:expire $unix_timestamp EXAT $unix_timestamp

#dont forget to add a publish/subscribe stream
#optional: add past_polls keys
echo "Redis keys configured."



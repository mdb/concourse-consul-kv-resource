setup() {
  docker-compose \
    --project-name="consul-kv-resource" \
    up \
      --detach

  sleep 5
}

teardown() {
  docker-compose \
    --project-name="consul-kv-resource" \
    down
}

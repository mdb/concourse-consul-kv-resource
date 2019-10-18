setup() {
  docker-compose \
    --project-name="consul-kv-resource" \
    up \
      --detach

  sleep 5

  # seed Consul with an initial K/V
  curl \
    --request "PUT" \
    --data "my-value" \
    http://localhost:8500/v1/kv/my-key
}

teardown() {
  docker-compose \
    --project-name="consul-kv-resource" \
    down
}

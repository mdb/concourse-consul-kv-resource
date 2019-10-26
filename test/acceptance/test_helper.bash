setup() {
  docker-compose \
    --project-name="consul-kv-resource" \
    up \
      --detach

  # wait for docker-compose to start
  sleep 5

  # seed Consul with an initial K/V
  curl \
    --request "PUT" \
    --data "my-value" \
    http://localhost:8500/v1/kv/my-key
}

teardown() {
  file=$(pwd)/test/acceptance/fixtures/my-key

  if [ -f "${file}" ]; then
    rm "${file}"
  fi

  docker-compose \
    --project-name="consul-kv-resource" \
    down
}

setup() {
  if [ "$(docker network ls | grep consul-kv-resource_default)" -eq 0 ]; then
    echo "docker-compose network already running..."
  else
    docker-compose \
      --project-name="consul-kv-resource" \
      up \
        --detach

    sleep 5
  fi

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
}

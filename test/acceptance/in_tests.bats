load test_helper

@test "1) /opt/resource/in: it fetches the Consul key value and writes it to a key name file in the destination directory" {
  fixture="$(cat test/acceptance/fixtures/in_params_with_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --volume $(pwd)/test/acceptance/fixtures:/fixtures \
      --network=consul-kv-resource_default \
      --user "$(id -u):$(id -g)" \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/in /fixtures"

  result="$(cat test/acceptance/fixtures/my-key)"

  [ "${result}" = "my-value" ]
}

@test "2) /opt/resource/in: it fetches the Consul key value and returns JSON reporting its value" {
  fixture="$(cat test/acceptance/fixtures/in_params_with_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --volume $(pwd)/test/acceptance/fixtures:/fixtures \
      --network=consul-kv-resource_default \
      --user "$(id -u):$(id -g)" \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/in /fixtures \
    | jq --raw-output '.version.value'"

  [ "${output}" = "my-value" ]
}

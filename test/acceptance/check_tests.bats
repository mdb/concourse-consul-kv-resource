load test_helper

@test "1) /opt/resource/check: it returns an error when the source is missing a 'host'" {
  fixture="$(cat test/acceptance/fixtures/check_incomplete_source.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/check"

  [ "$status" -eq 1 ]
  [ "${lines[0]}" = "Error: getaddrinfo ENOTFOUND undefined undefined:8500" ]
}

@test "2) /opt/resource/check: it returns an error when the key is absent from Consul" {
  fixture="$(cat test/acceptance/fixtures/check_nonexistent_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/check"

  [ "$status" -eq 1 ]
  [ "${lines[0]}" = "Error: my-key has no value" ]
}

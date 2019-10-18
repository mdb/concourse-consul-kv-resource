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
  [ "${lines[0]}" = "Error: my-nonexistent-key has no value" ]
}

@test "3) /opt/resource/check: it returns a JSON array containing a single version with the current key's value when a key exists in Consul but no existing version is passed in the source" {
  fixture="$(cat test/acceptance/fixtures/check_existing_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/check \
    | jq --raw-output '.[0].value'"

  [ "${output}" = "my-value" ]
}

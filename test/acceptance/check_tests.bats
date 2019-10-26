load test_helper

@test "1) /opt/resource/check: it returns an error when the source is missing a 'host'" {
  fixture="$(cat test/acceptance/fixtures/check_source_without_host.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/check"

  [ "$status" -eq 1 ]
  [ "${lines[0]}" = "Error: getaddrinfo ENOTFOUND undefined undefined:8500" ]
}

@test "2) /opt/resource/check: it returns an error when the source is missing a 'key'" {
  fixture="$(cat test/acceptance/fixtures/check_source_without_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/check"

  [ "$status" -eq 1 ]
  echo "${lines[0]}" | grep "Error: undefined has no value"
}

@test "3) /opt/resource/check: it returns an error when the key is absent from Consul" {
  fixture="$(cat test/acceptance/fixtures/check_nonexistent_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/check"

  [ "$status" -eq 1 ]
  [ "${lines[0]}" = "Error: my-nonexistent-key has no value" ]
}

@test "4) /opt/resource/check: it returns a JSON array containing a single version with the current key's value when a key exists in Consul but no existing version is passed to check" {
  fixture="$(cat test/acceptance/fixtures/check_existing_key.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/check \
    | jq --raw-output '.[0].value'"

  [ "${output}" = "my-value" ]
}

@test "5) /opt/resource/check: it returns an empty JSON array when a key exists in Consul with the same version value passed to check" {
  fixture="$(cat test/acceptance/fixtures/check_existing_key_and_version.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/check"

  [ "${output}" = "[]" ]
}

@test "6) /opt/resource/check: it returns a JSON array containing a single version with the current key's value when a key exists in Consul with a different version value passed to check" {
  fixture="$(cat test/acceptance/fixtures/check_existing_key_and_different_version.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm \
      --interactive \
      concourse-consul-kv-resource \
        /opt/resource/check \
    | jq --raw-output '.[0].value'"

  echo "${output}"

  [ "${output}" = "my-value" ]
}

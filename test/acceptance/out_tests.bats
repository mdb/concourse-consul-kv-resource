load test_helper

@test "1) /opt/resource/out: it updates the Consul key value with the value passed in its params" {
  fixture="$(cat test/acceptance/fixtures/out_params_with_value.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/out"

  new_key_value="$(curl \
    --request "GET" \
    http://localhost:8500/v1/kv/my-key \
    | jq -r '.[0].Value' \
    | base64 --decode)"

  [ "$status" -eq 0 ]
  [ "${new_key_value}" = "my-new-out-value" ]
}

@test "2) /opt/resource/out: it updates the Consul key value with the contents of a file passed in its params" {
  fixture="$(cat test/acceptance/fixtures/out_params_with_file.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --volume $(PWD)/test/acceptance/fixtures:/fixtures \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/out /fixtures"

  echo "${output}"

  new_key_value="$(curl \
    --request "GET" \
    http://localhost:8500/v1/kv/my-key \
    | jq -r '.[0].Value' \
    | base64 --decode)"

  echo "${new_key_value}"

  [ "$status" -eq 0 ]
  [ "${new_key_value}" = "my-value-from-a-file" ]
}

@test "3) /opt/resource/out: it prints a meaningful error when the file passed in its params does not exist" {
  fixture="$(cat test/acceptance/fixtures/out_params_with_nonexistent_file.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --volume $(PWD)/test/acceptance/fixtures:/fixtures \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/out /fixtures"

  [ "$status" -eq 1 ]
  echo "${output}" | grep "no such file or directory, open '/fixtures/does_not_exist'"
}

@test "4) /opt/resource/out: it prints a meaningful error when neither a 'file' nor a 'value' is present in the params" {
  fixture="$(cat test/acceptance/fixtures/out_with_empty_params.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --volume $(PWD)/test/acceptance/fixtures:/fixtures \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/out /fixtures"

  [ "$status" -eq 1 ]
  echo "${output}" | grep "Must pass required 'file' or 'value' params"
}

@test "5) /opt/resource/out: it prints a meaningful error when both a 'file' and a 'value' are present in the params" {
  fixture="$(cat test/acceptance/fixtures/out_with_both_file_and_value_params.json)"

  run bash -c "echo '${fixture}' \
    | docker run \
      --volume $(PWD)/test/acceptance/fixtures:/fixtures \
      --network=consul-kv-resource_default \
      --rm -i \
      concourse-consul-kv-resource \
        /opt/resource/out /fixtures"

  [ "$status" -eq 1 ]
  echo "${output}" | grep "Both 'file' and 'value' are present in params"
}

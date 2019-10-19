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

load test_helper

@test "1) /opt/resource/check: it returns an error when the source is missing a 'host'" {
  run bash -c "jq -n '{ source: { } }' | docker run --rm -i concourse-consul-kv-resource /opt/resource/check"

  [ "$status" -eq 1 ]
  [ "${lines[0]}" = "Error: getaddrinfo ENOTFOUND undefined undefined:8500" ]
}

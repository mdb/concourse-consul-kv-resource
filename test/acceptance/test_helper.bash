setup() {
  docker-compose up --detach

  sleep 5
}

teardown() {
  docker-compose down
}

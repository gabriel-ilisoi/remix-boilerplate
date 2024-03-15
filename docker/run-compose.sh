#!/bin/bash
script_path=$(dirname "$(readlink -f "$0")")
export CURRENT_UID=$(id -u)
export CURRENT_GUID=$(id -g)

if grep -sq 'docker\|lxc' /proc/1/cgroup; then
    echo "Cannot run inside a container"
    exit 1;
fi
BUILD_CMD="cd /app; rm -rf node_modules; \
npm install;\
npm run build;
"
EXTRA_ARGS="-d"
export WEB_MEM_LIMIT="1G"
#JEMALLOC="/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

# NOTE running without WS
if [ "$1" == "dev" ]; then
    echo "Running development command"
    export WEB_MEM_LIMIT="4G"
    export WEB_CMD='npm run dev'
elif [ "$1" == "start" ]; then
    echo "Running start command"
    export WEB_CMD="npx dotenv -e .env.production ./node_modules/@remix-run/serve/dist/cli.js build/server/index.js"
elif [ "$1" == "stop" ]; then
    echo "Running stop command"
    docker-compose -f "$script_path/docker-compose.yml" down 2>&1
    exit 0
elif [ "$1" == "build" ]; then
    echo "Running build command"
     export WEB_MEM_LIMIT="4G"
    export WEB_CMD=$BUILD_CMD
    EXTRA_ARGS="--abort-on-container-exit" # no detach
elif [ "$1" == "logs" ]; then
    echo "Running logs command"
    docker-compose -f "$script_path/docker-compose.yml" logs -f
    exit 0
else
    echo "Invalid argument. Usage: $0 [dev|start|stop|build|logs]"
    exit 1
fi

mkdir -p /tmp/rp-web-tmp
mkdir -p /tmp/rp-web-cache
# set +e
# docker build --build-arg CURRENT_GUID=$CURRENT_GUID CURRENT_UID=$CURRENT_UID -f ./Dockerfile.nodejs
docker-compose -f "$script_path/docker-compose.yml" down 2>&1
docker-compose -f "$script_path/docker-compose.yml" up --build $EXTRA_ARGS

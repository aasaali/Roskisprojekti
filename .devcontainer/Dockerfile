FROM mcr.microsoft.com/devcontainers/java:21-bullseye

RUN rm -f /etc/apt/sources.list.d/yarn.list

# Node frontille
ARG NODE_VERSION="20"
RUN su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION}"

# SQL ja mosquito MQTT
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends mariadb-client mosquitto-clients jq \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
#!/bin/sh
set -e

if [ -f /ssh-keys/id_ed25519_metodo_adt ]; then
  mkdir -p /root/.ssh
  cp /ssh-keys/id_ed25519_metodo_adt /root/.ssh/id_ed25519_metodo_adt
  cp /ssh-keys/id_ed25519_metodo_adt.pub /root/.ssh/id_ed25519_metodo_adt.pub
  [ -f /ssh-keys/known_hosts ] && cp /ssh-keys/known_hosts /root/.ssh/known_hosts
  chmod 700 /root/.ssh
  chmod 600 /root/.ssh/id_ed25519_metodo_adt
  chmod 644 /root/.ssh/id_ed25519_metodo_adt.pub
  chmod 644 /root/.ssh/known_hosts 2>/dev/null || true
fi

exec "$@"

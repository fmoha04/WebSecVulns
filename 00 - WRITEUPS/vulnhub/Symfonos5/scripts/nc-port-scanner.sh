#!/bin/bash

target="172.17.0.128"
ports="21 22 23 25 53 80 110 139 443 445 389 636 3306 5432 8080 8443"

for port in $ports; do
  proxychains nc -zv -w 2 $target $port 2>&1 | grep -E "OK"
done


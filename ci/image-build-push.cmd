@echo off
set IMAGE=rogrp6/smmp-smart-contract:latest
docker build . -t %IMAGE%
docker push %IMAGE%
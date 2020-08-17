#!/bin/bash

echo "Please log in using your Docker Hub credentials to update the container image"
docker login
docker tag webgoat:7.1 contrastsecuritydemo/webgoat:7.1
docker push contrastsecuritydemo/webgoat:7.1

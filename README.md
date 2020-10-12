# Webgoat 7: A deliberately insecure Java web application

This sample application is downloaded from https://github.com/WebGoat/WebGoat/releases/download/7.1/webgoat-container-7.1-exec.jar.

**Warning**: The computer running this application will be vulnerable to attacks, please take appropriate precautions.

# Running standalone

You can run WebGoat locally on any machine with Java 1.8 RE installed.

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Place a `contrast.jar` into the application's root folder.
1. Run the application using: 
```sh
java -javaagent:contrast.jar -Dcontrast.config.path=contrast_security.yaml -jar webgoat-container-7.1-exec.jar [--server.port=8080] [--server.address=localhost] 
```
1. Browse the application at http://localhost:8080/WebGoat/

# Running in Docker

You can run WebGoat within a Docker container. 

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Build the WebGoat container image using `./1-Build-Docker-Image.sh`. The Contrast agent is added automatically during the Docker build process.
1. Run the container using `docker run -v $PWD/contrast_security.yaml:/etc/contrast/java/contrast_security.yaml -p 8080:8080 webgoat:7.1`
1. Browse the application at http://localhost:8080/WebGoat/

# Running in Azure (Azure Container Instance):

## Pre-Requisites

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Install Terraform from here: https://www.terraform.io/downloads.html.
1. Install PyYAML using `pip install PyYAML`.
1. Install the Azure cli tools using `brew update && brew install azure-cli`.
1. Log into Azure to make sure you cache your credentials using `az login`.
1. Edit the [variables.tf](variables.tf) file (or add a terraform.tfvars) to add your initials, preferred Azure location, app name, server name and environment.
1. Run `terraform init` to download the required plugins.
1. Run `terraform plan` and check the output for errors.
1. Run `terraform apply` to build the infrastructure that you need in Azure, this will output the web address for the application. If you receive a HTTP 503 error when visiting the app then wait 30 seconds for the application to initialize.
1. Run `terraform destroy` when you would like to stop the app service and release the resources.

# Running automated tests

There is a test script which you can use to reveal vulnerabilities which requires node and puppeteer.

1. Install Node, NPM and Chrome.
1. From the app folder run `npm i puppeteer`.
1. Run `BASEURL=https://<your service name>.azurewebsites.net node exercise.js` or `BASEURL=https://<your service name>.azurewebsites.net DEBUG=true node exercise.js` to watch the automated script.

## Updating the Docker Image

You can re-build the docker image (used by Terraform) by running two scripts in order:

* 1-Build-Docker-Image.sh
* 2-Deploy-Docker-Image-To-Docker-Hub.sh

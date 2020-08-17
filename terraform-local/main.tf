#Terraform `provider` section is required since the `azurerm` provider update to 2.0+
provider "azurerm" {
  features {
  }
}

# Configure the Docker provider
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

data "external" "yaml" {
  program = ["python", "${path.module}/parseyaml.py"]
}

# Create a container
resource "docker_container" "webgoat7" {
  image = "contrastsecuritydemo/webgoat:7.1"
  name  = "webgoat7"

  ports {
    internal = 8080
    external = 8080
  }

  env = [
    "JAVA_TOOL_OPTIONS=-Dcontrast.api.url=${data.external.yaml.result.url} -Dcontrast.api.api_key=${data.external.yaml.result.api_key} -Dcontrast.api.service_key=${data.external.yaml.result.service_key} -Dcontrast.api.user_name=${data.external.yaml.result.user_name} -Dcontrast.standalone.appname=${var.appname} -Dcontrast.server=${var.servername} -Dcontrast.env=${var.environment}",
  ]
}


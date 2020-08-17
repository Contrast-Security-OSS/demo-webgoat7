variable "appname" {
  description = "The name of the app to display in Contrast TeamServer. Also used for DNS, so no spaces please!"
  default     = "webgoat7"
}

variable "servername" {
  description = "The name of the server to display in Contrast TeamServer."
  default     = "webgoat7-docker"
}

variable "environment" {
  description = "The Contrast environment for the app. Valid values: development, qa or production"
  default     = "development"
}


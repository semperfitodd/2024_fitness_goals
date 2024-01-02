variable "domain" {
  description = "Domain"
  type        = string

  default = "bernsonfamily.net"
}

variable "region" {
  description = "AWS Region where resources will be deployed"
  type        = string

  default = "us-east-1"
}

variable "tags" {
  description = "Tags to be applied to resources"
  type        = map(string)

  default = {}
}
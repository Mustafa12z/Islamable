
variable "image" {
  type        = string
  description = "docker image"
  
}


variable "container_name" {
  type        = string
  description = "name of container"
  
}



variable "ecs-cluster-name" {
  type        = string
  description = "ecs cluster name"
}

variable "capacity_providers" {
  type        = list(string)
  description = "capacity providers for ecs cluster"
}


variable "sg_id" {
  type = string
  description = "Security groups id"
}

variable "target_group_arn" {
    type = string
    description = "Target group"
  
}

variable "private_subnet_id" {
  type = string
  description = "Private subnet A"
}

variable "private_subnetb_id" {
  type = string
  description = "Private subnet B"
}
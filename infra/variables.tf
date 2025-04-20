# VPC
variable "vpc_name" {
  description = "Name tag for the VPC."
  type        = string
}

variable "igw_name" {
  description = "Name tag for the Internet Gateway."
  type        = string
}

variable "public_subnet_name" {
  description = "Name for public subnet."
  type        = string
}

variable "private_subnet_name" {
  description = "Name for private subnet."
  type        = string
}

variable "route_table_name" {
  description = "Name for the route table."
  type        = string
}

variable "sg_name" {
  description = "Security group name."
  type        = string
}

# ALB
variable "tg_name" {
  description = "Target group name."
  type        = string
}

variable "load_balancer_type" {
  description = "Type of load balancer (e.g., application)."
  type        = string
}

variable "alb_name" {
  description = "The name of the ALB."
  type        = string
}



# ECS
variable "image" {
  description = "Docker image."
  type        = string
}

variable "container_name" {
  description = "Name of container."
  type        = string
}

variable "ecs_cluster_name" {
  description = "ECS cluster name."
  type        = string
}

variable "capacity_providers" {
  description = "Capacity providers for ECS cluster."
  type        = list(string)
}

# Route 53
variable "root_domain_name" {
  description = "The domain name (e.g., islamable.com)."
  type        = string
}







variable "certificate_arn" {
  description = "The ARN of the ACM certificate."
  type        = string
}
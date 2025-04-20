

variable "root_domain_name" {
  description = "The root domain name (e.g., islamable.com)"
  type        = string
}

variable "alb_dns_name" {
  description = "The DNS name of the ALB"
  type        = string
}

variable "alb_zone_id" {
  description = "The hosted zone ID for the ALB (get from ALB output)"
  type        = string
}

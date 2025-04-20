data "aws_route53_zone" "hz" {
  name = var.root_domain_name
}

# 🔹 ACM Certificate
resource "aws_acm_certificate" "islamable" {
  domain_name               = var.root_domain_name
  validation_method         = "DNS"
  subject_alternative_names = ["www.${var.root_domain_name}"]

  lifecycle {
    create_before_destroy = true
  }
}

# 🔹 DNS Validation Records
resource "aws_route53_record" "islamable_validation" {
  for_each = {
    for dvo in aws_acm_certificate.islamable.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = data.aws_route53_zone.hz.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 300
}

# 🔹 Validate the ACM Certificate
resource "aws_acm_certificate_validation" "islamable" {
  certificate_arn         = aws_acm_certificate.islamable.arn
  validation_record_fqdns = [for record in aws_route53_record.islamable_validation : record.fqdn]
}

# 🔹 A Record for root domain (e.g., islamable.com)
resource "aws_route53_record" "root_domain" {
  zone_id = data.aws_route53_zone.hz.zone_id
  name    = var.root_domain_name
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

# 🔹 A Record for www domain (e.g., www.islamable.com)
resource "aws_route53_record" "www_domain" {
  zone_id = data.aws_route53_zone.hz.zone_id
  name    = "www"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

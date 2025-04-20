module "vpc" {
  source              = "./modules/vpc"
  public_subnet_name  = var.public_subnet_name
  sg_name             = var.sg_name
  igw_name            = var.igw_name
  vpc_name            = var.vpc_name
  private_subnet_name = var.private_subnet_name
  route_table_name    = var.route_table_name
}

module "alb" {
  source             = "./modules/alb"
  tg_name            = var.tg_name
  load_balancer_type = var.load_balancer_type
  alb-name           = var.alb_name
  certificate_arn    = module.route-53.certificate_arn
  public_subnetb_id  = module.vpc.public_subnet_b_id
  public_subnet_id   = module.vpc.public_subnet_a_id
  sg_id              = module.vpc.security_group_id
  vpc_id             = module.vpc.vpc_id
}

module "ecs" {
  source             = "./modules/ecs"
  image              = var.image
  container_name     = var.container_name
  ecs-cluster-name   = var.ecs_cluster_name
  capacity_providers = var.capacity_providers
  private_subnet_id  = module.vpc.private_subnet_a_id
  private_subnetb_id = module.vpc.private_subnet_b_id
  sg_id              = module.vpc.security_group_id
  target_group_arn   = module.alb.target_group_arn
}

module "route-53" {
  source           = "./modules/route-53"
  root_domain_name = var.root_domain_name
  alb_zone_id      = module.alb.alb_zone_id
  alb_dns_name     = module.alb.alb_dns_name

}

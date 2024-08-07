module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"
  version = "3.1.1"

  name          = local.environment
  description   = "API Gateway for ${local.environment} environment"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "authorization"]
    allow_methods = ["OPTIONS", "GET", "POST"]
  }

  create_default_stage        = true
  domain_name                 = local.fitness_site_domain
  domain_name_certificate_arn = aws_acm_certificate.this.arn

  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.api_gw.arn

  default_route_settings = {
    throttling_burst_limit = 10
    throttling_rate_limit  = 20
  }

  integrations = {
    "GET /totals" = {
      lambda_arn = module.lambda_function_totals.lambda_function_invoke_arn
    }
    "POST /insert" = {
      lambda_arn = module.lambda_function_insert.lambda_function_invoke_arn
    }
  }

  tags = var.tags
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${local.environment}"

  retention_in_days = 3
}
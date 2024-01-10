module "lambda_function_totals" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${local.environment}_get_function"
  description   = "${local.environment} function to get data from DynamoDB"
  handler       = "totals.lambda_handler"
  publish       = true
  runtime       = "python3.11"
  timeout       = 30

  environment_variables = {
    DYNAMO_TABLE      = module.dynamo_daily.dynamodb_table_id
    EXERCISE_TYPES    = "Pullup,Pushup,Squat,HSPU"
    HSPU_DAILY_GOAL   = "3"
    HSPU_YEAR_GOAL    = "1200"
    PULLUP_DAILY_GOAL = "70"
    PULLUP_YEAR_GOAL  = "25000"
    PUSHUP_DAILY_GOAL = "140"
    PUSHUP_YEAR_GOAL  = "50000"
    SQUAT_DAILY_GOAL  = "110"
    SQUAT_YEAR_GOAL   = "40000"
  }

  source_path = [
    {
      path             = "${path.module}/totals"
      pip_requirements = true
    }
  ]

  attach_policies = true
  policies        = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]

  attach_policy_statements = true
  policy_statements = {
    dynamo = {
      effect    = "Allow",
      actions   = ["dynamodb:*"],
      resources = [module.dynamo_daily.dynamodb_table_arn]
    }
  }

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  cloudwatch_logs_retention_in_days = 3

  tags = var.tags
}

module "lambda_function_insert" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${local.environment}_insert_function"
  description   = "${local.environment} function to record data to DynamoDB"
  handler       = "insert.lambda_handler"
  publish       = true
  runtime       = "python3.11"
  timeout       = 30

  environment_variables = {
    DYNAMO_TABLE = module.dynamo_daily.dynamodb_table_id
  }

  source_path = [
    {
      path             = "${path.module}/insert"
      pip_requirements = false
    }
  ]

  attach_policies = true
  policies        = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]

  attach_policy_statements = true
  policy_statements = {
    dynamo = {
      effect    = "Allow",
      actions   = ["dynamodb:*"],
      resources = [module.dynamo_daily.dynamodb_table_arn]
    }
  }

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  cloudwatch_logs_retention_in_days = 3

  tags = var.tags
}
module "dynamo_daily" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name = "${local.environment}_daily"

  server_side_encryption_enabled = false
  deletion_protection_enabled    = true

  hash_key    = "Date"
  range_key   = "ExerciseType"
  table_class = "STANDARD"

  ttl_enabled        = true
  ttl_attribute_name = "expire"

  attributes = [{
    name = "Date"
    type = "S"
    }, {
    name = "ExerciseType"
    type = "S"
    }
  ]

  tags = var.tags
}

module "dynamo_totals" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name = "${local.environment}_totals"

  server_side_encryption_enabled = false
  deletion_protection_enabled    = true

  hash_key    = "ExerciseType"
  table_class = "STANDARD"

  ttl_enabled        = true
  ttl_attribute_name = "expire"

  attributes = [{
    name = "ExerciseType"
    type = "S" # The type of exercise (Pullup, Pushup, Squat)
    }
  ]

  tags = var.tags
}
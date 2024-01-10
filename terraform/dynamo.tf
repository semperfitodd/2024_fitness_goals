module "dynamo_daily" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name = "${local.environment}_daily"

  server_side_encryption_enabled = false
  deletion_protection_enabled    = true

  hash_key    = "Date"
  range_key   = "ExerciseType"
  table_class = "STANDARD"

  ttl_enabled = false

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

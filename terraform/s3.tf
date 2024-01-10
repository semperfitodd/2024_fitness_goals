data "aws_iam_policy_document" "fitness_site" {
  statement {
    effect = "Allow"
    principals {
      identifiers = module.cdn.cloudfront_origin_access_identity_iam_arns
      type        = "AWS"
    }
    actions   = ["s3:GetObject"]
    resources = ["${module.site_s3_bucket.s3_bucket_arn}/*"]
  }
}

locals {
  environment = "2024_fitness"

  fitness_site_domain = "fitness.${var.domain}"

  site_directory = "${path.module}/static-site/build"

  mime_types = {
    "css"  = "text/css"
    "html" = "text/html"
    "ico"  = "image/ico"
    "jpg"  = "image/jpeg"
    "js"   = "application/javascript"
    "json" = "application/json"
    "map"  = "application/octet-stream"
    "png"  = "image/png"
    "txt"  = "text/plain"
  }
}

module "site_s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = local.fitness_site_domain

  attach_public_policy = true
  attach_policy        = true
  policy               = data.aws_iam_policy_document.fitness_site.json

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  expected_bucket_owner = data.aws_caller_identity.current.account_id

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = var.tags
}

resource "aws_s3_object" "website-object" {
  for_each = fileset(local.site_directory, "**/*")

  bucket       = module.site_s3_bucket.s3_bucket_id
  key          = each.value
  source       = "${local.site_directory}/${each.value}"
  etag         = filemd5("${local.site_directory}/${each.value}")
  content_type = lookup(local.mime_types, split(".", each.value)[length(split(".", each.value)) - 1])
}

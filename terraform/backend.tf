terraform {
  backend "s3" {
    bucket = "bernson.terraform"
    key    = "2024_fitness_goals"
    region = "us-east-2"
  }
}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.72.1"
    }

  }
}

provider "aws" {
  region = "eu-west-2"
}

terraform {
  backend "s3" {
    bucket  = "islamable2"
    key     = "terraform/state/islamable.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }
}

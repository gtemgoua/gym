terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 5.0"
    }
  }
}

provider "heroku" {
  // export HEROKU_API_KEY before running terraform
}

resource "heroku_app" "api" {
  name   = "gym-saas-api"
  region = "us"
  stack  = "container"
}

resource "heroku_app" "web" {
  name   = "gym-saas-web"
  region = "us"
  stack  = "container"
}

resource "heroku_addon" "postgres" {
  app  = heroku_app.api.name
  plan = "heroku-postgresql:standard-0"
}

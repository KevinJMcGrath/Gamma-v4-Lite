# Symphony Self-Service Site

> This repo contains the code necessary to deploy the Symphony Self-Service front-end. 

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# Note: a pre-dev script called init_env.js is included to copy the .env file from .env_dev.
# The deployment scripts assume the following files exist:
# .env_dev
# .env_uat
# .env_prod
# app_dev.yaml
# app_prod.yaml
```

## Deploy Builds to GCP

``` pwsh
# deploy to UAT
./app_deploy.ps1 --deploy_type uat

# deploy to Production
./app_deploy.ps1 --deploy_type prod
```


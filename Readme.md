# General information
Inspired by article https://www.infoq.com/articles/aws-codepipeline-deploy-docker/. Repository is forked from https://github.com/dvohra/docker-node-server.

Assumptions are:

Description | Value
----------- | ------
Task definition file | taskdef.json
Task family name | node-server
CloudFormation stack name | node-server
CloudFormation template | cf-ecs.yml

# Docker image

```shell
docker build --rm -t bizm/node-server .
docker run -it --rm -p 127.0.0.1:8080:8080 bizm/node-server:latest
docker push bizm/node-server:latest
```

# AWS CLI

## Task definition

Task is defined in JSON template that is not used by CloudFormation. Reason is that this json file is required for CodePipeline. Thus task must be created before executing resource creation via CloudFormation.

```shell
# create new task definition or add a new revision to existing one
aws ecs register-task-definition --cli-input-json file://taskdef.json

# remove task definition, must provide <family-name>:<revision>, e.g.:
aws ecs deregister-task-definition --task-definition node-server:1
```

## CloudFormation stack

All the required resources should be created by CloudFormation via `aws cloudformation` command. CloudFormation templates are YAML files starting with `cf-` preffix.

```shell
# list currently existing stacks
aws cloudformation list-stacks

# validate cloudformation template
aws cloudformation validate-template --template-body file://cf-ecs.yml

# create new stack
aws cloudformation create-stack --stack-name node-server --template-body file://cf-ecs.yml --parameters file://<parameters-file>

# update existing stack
aws cloudformation update-stack --stack-name node-server --template-body file://cf-ecs.yml --parameters file://<parameters-file>

# describe stack events
aws cloudformation describe-stack-events --stack-name node-server --max-items <max-number-of-events>

# delete stack
aws cloudformation delete-stack --stack-name node-server
```

## ECS

```shell
# list clusters
aws ecs list-clusters
# scale service up/down
aws ecs update-service --cluster <cluster-arn> --service node-server-service --desired-count <desired-count>
aws ecs update-service --cluster node-server-cluster --service node-server-service --desired-count <desired-count>
```

# ECS CLI

```shell
# configure ecs-cli
ecs-cli configure --region eu-central-1 --cluster node-server-cluster --config-name node-server
# list containers
ecs-cli ps --cluster-config node-server
# get task logs
ecs-cli logs --task-id <task-id> --follow --cluster-config node-server
```

# Container metadata

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-metadata.html
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint-v3.html

# Etc

https://stackoverflow.com/questions/48006598/how-fast-can-ecs-fargate-boot-a-container?rq=1
--
ECS workshop
https://ecsworkshop.com/
https://github.com/brentley/ecsdemo-frontend
https://github.com/brentley/ecsdemo-nodejs
https://github.com/brentley/ecsdemo-crystal
https://github.com/brentley/container-demo
--

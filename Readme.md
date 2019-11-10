# General information
Inspired by article https://www.infoq.com/articles/aws-codepipeline-deploy-docker/. Repository is forked from https://github.com/dvohra/docker-node-server.

Assumptions are:

Description | Value
----------- | ------
Task definition file | taskdef.json
Task family name | node-server
CloudFormation stack name | node-server
CloudFormation template | cf-ecs.yml
CloudFormation parameters | cf-ecs-parameters.json

# Docker image

```shell
mvn clean compile package
docker build --rm -t bizm/teosto-session .
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
aws cloudformation create-stack --stack-name node-server --template-body file://cf-ecs.yml --parameters file://cf-ecs-parameters.json
aws cloudformation create-stack --stack-name node-server-pipeline --template-body file://cf-codepipeline.yml --capabilities CAPABILITY_IAM

# update existing stack
aws cloudformation update-stack --stack-name node-server --template-body file://cf-ecs.yml --parameters file://cf-ecs-parameters.json

# describe stack events
aws cloudformation describe-stack-events --stack-name node-server --max-items <max-number-of-events>

# delete stack
aws cloudformation delete-stack --stack-name node-server
```

## Fancy stuff

```shell
# List webhooks
aws codepipeline list-webhooks --endpoint-url "https://codepipeline.eu-central-1.amazonaws.com" --region "eu-central-1"
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

# Code Build

We start here
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codebuild-project.html

Some awesome shit!
https://stelligent.com/2017/03/09/using-parameter-store-with-aws-codepipeline/

# Code pipeline

General info
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html
ActionDeclaration
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html#cfn-codepipeline-pipeline-stages-actions-configuration
More detailed info
https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#structure-configuration-examples

# Etc

...  
https://stackoverflow.com/questions/48006598/how-fast-can-ecs-fargate-boot-a-container?rq=1

--

ECS workshop  
https://ecsworkshop.com/  
https://github.com/brentley/ecsdemo-frontend  
https://github.com/brentley/ecsdemo-nodejs  
https://github.com/brentley/ecsdemo-crystal  
https://github.com/brentley/container-demo

--

https://aws.amazon.com/premiumsupport/knowledge-center/multiple-values-list-parameter-cli/

https://aws.amazon.com/blogs/compute/task-networking-in-aws-fargate/

CodePipeline + Secrets Manager  
https://medium.com/@eoins/securing-github-tokens-in-a-serverless-codepipeline-dc3a24ddc356

CloudFormation dynamic references (e.g. Secrets)  
https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html

CloudFormation code pipeline + GitHub source  
https://docs.aws.amazon.com/code-samples/latest/catalog/cloudformation-codepipeline-template-codepipeline-github-events-yaml.yml.html

Webhook for GitHub  
https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-webhooks-create.html

Simples implementation of HTTP server in Java  
https://stackoverflow.com/questions/3732109/simple-http-server-in-java-using-only-java-se-api

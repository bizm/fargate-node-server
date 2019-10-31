# General information
Inspired by article https://www.infoq.com/articles/aws-codepipeline-deploy-docker/. Repository is forked from https://github.com/dvohra/docker-node-server.

# AWS CLI

## Task definition

Task is defined in JSON template that is not used by CloudFormation. Reason is that this json file is required for CodePipeline. Thus task must be created before executing resource creation via CloudFormation.

```shell
# create new task definition or add a new revision to existing one
aws ecs register-task-definition --cli-input-json file://taskdef.json

# remove task definition
aws ecs deregister-task-definition --task-definition <family>:<revision>
```

## CloudFormation stack

All the required resources should be created by CloudFormation via `aws cloudformation` command. CloudFormation templates are YAML files starting with `cf-` preffix.

```shell
# list currently existing stacks
aws cloudformation list-stacks

# validate cloudformation template
aws cloudformation validate-template --template-body file://<template-file>

# create new stack
aws cloudformation create-stack --stack-name node-server --template-body file://<template-file> --parameters file://<parameters-file>

# update existing stack
aws cloudformation update-stack --stack-name node-server --template-body file://<template-file> --parameters file://<parameters-file>

# describe stack events
aws cloudformation describe-stack-events --stack-name <stack-name> --max-items <max-number-of-events>

# delete stack
aws cloudformation delete-stack --stack-name sora-api-vpc-dev
```

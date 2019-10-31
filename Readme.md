# General information
https://www.infoq.com/articles/aws-codepipeline-deploy-docker/
forked from https://github.com/dvohra/docker-node-server

# AWS CLI

## Task definition

Task is defined in JSON template that is not used by CloudFormation. Reason is that this json file is required for CodePipeline. Thus task must be created before executing resource creation via CloudFormation.

```
aws ecs register-task-definition --cli-input-json file://taskdef.json
```

This command will create a task definition if it doesn't exist or add a new revision to existing one.

Task definition revisions can be removed by
```
aws ecs deregister-task-definition --task-definition <family>:<revision>
```

## CloudFormation stack

All the required resources should be created by CloudFormation via `aws cloudformation` command. CloudFormation templates are YAML files starting with `cf-` preffix.

```
# List currently existing stacks
aws cloudformation list-stacks

# Validate cloudformation template
aws cloudformation validate-template --template-body file://<template-file>

# Create new stack
aws cloudformation create-stack --stack-name node-server --template-body file://<template-file> --parameters file://<parameters-file>

# Update existing stack
aws cloudformation update-stack --stack-name node-server --template-body file://<template-file> --parameters file://<parameters-file>

# Delete stack
aws cloudformation delete-stack --stack-name sora-api-vpc-dev
```

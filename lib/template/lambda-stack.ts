import * as cdk from 'aws-cdk-lib';
import {
  Duration,
  aws_iam as iam,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const memorySize = 128
    const timeoutSecond = 30
    const policyName = "lambda-role-policy"
    const policy = new iam.ManagedPolicy(this, policyName, {
      managedPolicyName: policyName,
      statements: [
        new iam.PolicyStatement({
          actions: [
            "sts:AssumeRole",
          ],
          resources: ["*"]
        }),
  
      ],
    });

    const roleName =  "lambda-role"
    const lambdaRole = new iam.Role(this, roleName, {
      roleName: roleName,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        policy,
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
    });

    new lambda.Function(this, "LambdaFunction", {
      // StackSets の場合、なぜかコードを別に用意する方法ではNoSuchBucket エラーになる
      // code: new lambda.AssetCode("./lambda"),
      code: new lambda.InlineCode(`
      def lambda_handler(event, context):
          return {
              'statusCode': 200,
              'body': 'Hello from Lambda!'
          }
      `),
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "default_vpc.lambda_handler",
      memorySize: memorySize,
      role: lambdaRole,
      timeout: Duration.seconds(timeoutSecond),
      functionName: "cdk-lambda-stacksets"
    });
  }
}

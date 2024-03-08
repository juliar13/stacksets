import * as cdk from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as path from 'path';
import {
  Duration,
  aws_iam as iam,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Runtime, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class CloudtrailStack extends cdk.Stack {
  private LambdaDefaultRuntime = lambda.Runtime.PYTHON_3_12
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    /**
     * Create Switch Role
     */
    const bastion_aws_account_id = '058264188814';
    const switchRole = new iam.Role(this, 'SwitchRole', {
      assumedBy: new iam.AccountPrincipal(bastion_aws_account_id).withConditions({
        // Bool: {},
        StringEquals: { "sts:RoleSessionName": "${aws:username}" }
      }),
      roleName: 'djuliar-iamrole-bastion-test',
    });
    switchRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    const memorySize = 128 // this.node.tryGetContext("lambda").defaultMemorySize
    const timeoutSecond = 30 // this.node.tryGetContext("lambda").defaultTimeOut
    const policyName = "lambda-role-policy" // Naming.of("lambda-role-policy");
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
    const roleName =  "lambda-role" // Naming.of("lambda-role");
    const lambdaRole = new iam.Role(this, roleName, {
      roleName: roleName,
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        policy,
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
    });
    new lambda.Function(this, "DefaultVpcLambdaFunction", {
      code: new lambda.AssetCode("./lambda"),
      /**
       * 11:28:24 PM | UPDATE_FAILED        | AWS::CloudFormation::StackSet | Stackset
Resource handler returned message: "Resource of type 'Stack set operation [ca256b38-7612-4fef-8404-4fcaa7b522ce] was unexpectedly stopped or fa
iled. status reason(s): [ResourceLogicalId:DefaultVpcLambdaFunctionC6B79DAD, ResourceType:AWS::Lambda::Function, ResourceStatusReason:Resource
handler returned message: "Error occurred while GetObject. S3 Error Code: NoSuchKey. S3 Error Message: The specified key does not exist. (Servi
ce: Lambda, Status Code: 400, Request ID: 2c02f6b6-e62a-4cb8-924c-26e8f55c6a30)" (RequestToken: ee545b01-5cf0-72f0-e16b-960e4ce6e5e3, HandlerEr
rorCode: InvalidRequest).]' with identifier 'cloudtrail-stack:92c9b9cd-b9c0-45f8-b5f1-f74ebd8df8e8' did not stabilize." (RequestToken: dd548f6e
-cc27-f92b-c7cd-68dc63fb31a9, HandlerErrorCode: NotStabilized)
       */
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "default_vpc.lambda_handler",
      memorySize: memorySize,
      role: lambdaRole,
      timeout: Duration.seconds(timeoutSecond),
      functionName: "cdk-lambda-stacksets"
    });

    // /**
    //  * Create S3
    //  */
    // const bucket = new s3.Bucket(this, 'Bucket', {
    //   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    //   bucketName: `stacksets-cloudtrail-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}-test`,
    //   encryption: s3.BucketEncryption.S3_MANAGED,
    //   removalPolicy: cdk.RemovalPolicy.RETAIN,
    // });
    // /**
    //  * Create S3
    //  */
    // const bucket_tf_state = new s3.Bucket(this, 'BucketTfState', {
    //   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    //   bucketName: `stacksets-tf-state-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
    //   encryption: s3.BucketEncryption.S3_MANAGED,
    //   removalPolicy: cdk.RemovalPolicy.RETAIN,
    // });
    // /**
    //  * Create S3
    //  */
    // const bucket_access_log = new s3.Bucket(this, 'BucketAccessLog', {
    //   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    //   bucketName: `stacksets-access-log-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
    //   encryption: s3.BucketEncryption.S3_MANAGED,
    //   removalPolicy: cdk.RemovalPolicy.RETAIN,
    // });
    /**
     * Create CloudTrail
     */
    // new cloudtrail.Trail(this, 'CloudTrail', {
    //   bucket: bucket,
    //   enableFileValidation: true,
    //   isMultiRegionTrail: true,
    //   sendToCloudWatchLogs: false,
    //   trailName: `cloudtrail-${cdk.Aws.ACCOUNT_ID}`,
    // });
  }
}

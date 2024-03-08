import * as cdk from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class CloudtrailStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Create S3
     */
    const bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: `stacksets-cloudtrail-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}-test`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    /**
     * Create CloudTrail
     */
    new cloudtrail.Trail(this, 'CloudTrail', {
      bucket: bucket,
      enableFileValidation: true,
      isMultiRegionTrail: true,
      sendToCloudWatchLogs: false,
      trailName: `cloudtrail-${cdk.Aws.ACCOUNT_ID}`,
    });
  }
}

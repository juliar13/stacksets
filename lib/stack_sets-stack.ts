import * as cdk from 'aws-cdk-lib';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface props extends cdk.StackProps {
  stackSetsName: string;
  regions: string[];
  accounts?: string[];
  organizationalUnitIds?: string[];
  templateBody: string;
}

export class StackSetsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'StackSetsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    new cfn.CfnStackSet(this, 'Stackset', {
      permissionModel: props.accounts !== undefined ? 'SELF_MANAGED' : 'SERVICE_MANAGED',
      stackSetName: `${props.stackSetsName}`,
      autoDeployment:
        props.accounts !== undefined
          ? undefined
          : {
              enabled: true,
              retainStacksOnAccountRemoval: false,
            },
      capabilities: ['CAPABILITY_NAMED_IAM'],
      stackInstancesGroup: [
        {
          regions: props.regions,
          deploymentTargets:
            props.accounts !== undefined ? { accounts: props.accounts } : { organizationalUnitIds: props.organizationalUnitIds },
        },
      ],
      callAs: "DELEGATED_ADMIN",
      templateBody: props.templateBody,
    });
  }
}

import * as cdk from 'aws-cdk-lib';
import {
  aws_iam as iam,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class CloudtrailStack extends cdk.Stack {
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
  }
}

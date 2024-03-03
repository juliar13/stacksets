#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StackSetsStack } from '../lib/stack_sets-stack';
import { CloudtrailStack } from '../lib/template/cloudtrail-stack';

const app = new cdk.App();
const stage = new cdk.Stage(app, 'template');
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT, // "851725447156",
  region: process.env.CDK_DEFAULT_REGION    // "ap-northeast-1"
};

new CloudtrailStack(stage, 'CloudTrailStack', {
  synthesizer: new cdk.DefaultStackSynthesizer({ generateBootstrapVersionRule: false }),
});
const template1 = stage.synth().stacks[0].template;

// const app = new cdk.App();
new StackSetsStack(app, 'StackSetsStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

  stackSetsName: 'cloudtrail-stack',
  env: env,
  organizationalUnitIds: ['ou-213w-190ou3ha'], // Sandbox OU
  regions: ['ap-northeast-1'],
  templateBody: JSON.stringify(template1),
});
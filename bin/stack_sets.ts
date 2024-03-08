#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StackSetsStack } from '../lib/stack_sets-stack';
import { LambdaStack } from '../lib/template/lambda-stack';

const app = new cdk.App();
const stage = new cdk.Stage(app, 'template');
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

new LambdaStack(stage, 'CloudTrailStack', {
  synthesizer: new cdk.DefaultStackSynthesizer({ generateBootstrapVersionRule: false }),
});
const template1 = stage.synth().stacks[0].template;

new StackSetsStack(app, 'StackSetsStack', {
  stackSetsName: 'stacksets-test',
  env: env,
  organizationalUnitIds: ['ou-213w-190ou3ha'], // Sandbox OU
  regions: ['ap-northeast-1'],
  templateBody: JSON.stringify(template1),
});

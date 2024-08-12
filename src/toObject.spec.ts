import assert from 'node:assert'
import { describe, it } from 'node:test'
import { toObject } from './toObject.js'

void describe('toObject()', () => {
	void it('should convert CloudFormation Stack Outputs to a React App environment', () =>
		assert.deepEqual(
			toObject([
				{
					OutputKey: 'websiteBucketName',
					OutputValue: 'asset-tracker-websitbucketc74c6fbf-e126q3sws4eq',
					ExportName: 'asset-tracker:websiteBucketName',
				},
				{
					OutputKey: 'userPoolClientId',
					OutputValue: '7mfbudbt5eq56kgo2244sa9kc8',
					ExportName: 'asset-tracker:userPoolClientId',
				},
				{
					OutputKey: 'mqttEndpoint',
					OutputValue: 'a34x44yyrk96tg-ats.iot.eu-central-1.amazonaws.com',
					ExportName: 'asset-tracker:mqttEndpoint',
				},
				{
					OutputKey: 'userPoolId',
					OutputValue: 'eu-central-1_KBMdKxWIt',
					ExportName: 'asset-tracker:userPoolId',
				},
				{
					OutputKey: 'identityPoolId',
					OutputValue: 'eu-central-1:5b979419-01d8-498a-a024-c344ac2a3301',
					ExportName: 'asset-tracker:identityPoolId',
				},
				{
					OutputKey: 'websiteDomainName',
					OutputValue:
						'asset-tracker-websitbucketc74c6fbf-e126q3sws4eq.s3.eu-central-1.amazonaws.com',
					ExportName: 'asset-tracker:websiteDomainName',
				},
			]),
			{
				websiteBucketName: 'asset-tracker-websitbucketc74c6fbf-e126q3sws4eq',
				userPoolClientId: '7mfbudbt5eq56kgo2244sa9kc8',
				mqttEndpoint: 'a34x44yyrk96tg-ats.iot.eu-central-1.amazonaws.com',
				userPoolId: 'eu-central-1_KBMdKxWIt',
				identityPoolId: 'eu-central-1:5b979419-01d8-498a-a024-c344ac2a3301',
				websiteDomainName:
					'asset-tracker-websitbucketc74c6fbf-e126q3sws4eq.s3.eu-central-1.amazonaws.com',
			},
		))
})

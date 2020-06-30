import * as https from 'https'
import * as url from 'url'
import { CloudFormationCustomResourceEvent } from 'aws-lambda'

export enum ResponseStatus {
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
}

export type CfnResponseCommonArgs = {
	/**
	 * This value should be an identifier unique to the custom resource vendor, and can be up to 1 Kb in size. The value must be a non-empty string and must be identical for all responses for the same resource.
	 */
	PhysicalResourceId: string
	/**
	 * Pass the received event verbatim
	 */
	event: CloudFormationCustomResourceEvent
	/**
	 * Indicates whether to mask the output of the custom resource when retrieved by using the Fn::GetAtt function.
	 * If set to true, all returned values are masked with asterisks (*****), except for those stored in the Metadata section of the template.
	 * CloudFormation does not transform, modify, or redact any information you include in the Metadata section.
	 * The default value is false.
	 */
	NoEcho?: boolean
	/**
	 * The custom resource provider-defined name-value pairs to send with the response.
	 * You can access the values provided here by name in the template with Fn::GetAtt.
	 */
	Data?: Record<string, any>
}

export type CfnResponseFuncResult = {
	/**
	 * The update sent to CloudFormation
	 */
	status: Pick<CfnResponseCommonArgs, 'PhysicalResourceId' | 'Data'> & {
		/**
		 * The status value sent by the custom resource provider in response to an AWS CloudFormation-generated request.
		 */
		Status: ResponseStatus
		/**
		 * Indicates whether to mask the output of the custom resource when retrieved by using the Fn::GetAtt function.
		 * If set to true, all returned values are masked with asterisks (*****), except for those stored in the Metadata section of the template.
		 * CloudFormation does not transform, modify, or redact any information you include in the Metadata section.
		 * The default value is false.
		 */
		NoEcho: boolean
		/**
		 * The Amazon Resource Name (ARN) that identifies the stack that contains the custom resource.
		 */
		StackId: string
		/**
		 * A unique ID for the request.
		 */
		RequestId: string
		/**
		 * The template developer-chosen name (logical ID) of the custom resource in the AWS CloudFormation template.
		 */
		LogicalResourceId: string
	}
	result: {
		/**
		 * HTTP Status code of the CloudFormation service response
		 */
		statusCode?: number
		/**
		 * Body of the CloudFormation service response
		 */
		body: string
	}
}

export type CfnResponseFunc = {
	(
		args: CfnResponseCommonArgs & {
			/**
			 * The status value sent by the custom resource provider in response to an AWS CloudFormation-generated request.
			 */
			Status: ResponseStatus.SUCCESS
			/**
			 * Describes the reason for a failure response.
			 *
			 * Reason is optional when Status is SUCCESS
			 */
			Reason?: string
		},
	): Promise<CfnResponseFuncResult>
	(
		args: CfnResponseCommonArgs & {
			/**
			 * The status value sent by the custom resource provider in response to an AWS CloudFormation-generated request.
			 */
			Status: ResponseStatus.FAILED
			/**
			 * Describes the reason for a failure response.
			 *
			 * Must provide Reason when Status is FAILED
			 */
			Reason: string
		},
	): Promise<CfnResponseFuncResult>
}

/**
 * Sends a custom resource provider response
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html
 */
export const cfnResponse: CfnResponseFunc = async ({
	Status,
	Reason,
	PhysicalResourceId,
	event,
	NoEcho,
	Data,
}: {
	Status: ResponseStatus
	Reason?: string
	PhysicalResourceId: string
	event: CloudFormationCustomResourceEvent
	NoEcho?: boolean
	Data?: Record<string, any>
}): Promise<CfnResponseFuncResult> => {
	if (Status === ResponseStatus.FAILED && Reason === undefined) {
		throw new Error(
			`Must provide Reason when Status is ${ResponseStatus.FAILED}`,
		)
	}
	const status = {
		Status,
		Reason,
		PhysicalResourceId,
		StackId: event.StackId,
		RequestId: event.RequestId,
		LogicalResourceId: event.LogicalResourceId,
		NoEcho: NoEcho ?? false,
		Data,
	}
	const parsedUrl = url.parse(event.ResponseURL)

	const res = await new Promise<{ statusCode?: number; body: string }>(
		(resolve, reject) => {
			const responseBody = JSON.stringify(status)

			const request = https.request(
				{
					hostname: parsedUrl.hostname,
					port: 443,
					path: parsedUrl.path,
					method: 'PUT',
					headers: {
						'content-type': 'application/json; charset=utf-8',
						'content-length': responseBody.length,
					},
				},
				(res) => {
					const data: string[] = []
					res.on('data', (chunk) => data.push(chunk))
					res.on('end', function () {
						resolve({
							statusCode: res.statusCode,
							body: data.join(''),
						})
					})
				},
			)
			request.on('error', reject)
			request.end(responseBody)
		},
	)

	return {
		status,
		result: res,
	}
}

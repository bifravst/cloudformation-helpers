import { Output } from '@aws-sdk/client-cloudformation'

export const toObject = (output: Output[]): Record<string, string> =>
	output.reduce(
		(env, { OutputKey, OutputValue }) => ({
			...env,
			[`${OutputKey}`]: `${OutputValue}`,
		}),
		{} as ReturnType<typeof toObject>,
	)

import { CloudFormation } from 'aws-sdk'
import { toObject } from './toObject'

/**
 * Returns the outputs of a CloudFormation stack as an object
 */
export const stackOutput = async <T extends { [key: string]: string }>(args: {
	stackId: string
	region?: string
}): Promise<T> => {
	const { region, stackId } = args
	const cf = new CloudFormation({ region })
	const { Stacks } = await cf.describeStacks({ StackName: stackId }).promise()
	if (!Stacks || !Stacks.length || !Stacks[0].Outputs) {
		throw new Error(`Stack ${stackId} not found.`)
	}
	return toObject(Stacks[0].Outputs) as T
}

import { CloudFormation } from 'aws-sdk'
import { toObject } from './toObject'

/**
 * Returns the outputs of a CloudFormation stack as an object
 */
export const stackOutput = (cf: CloudFormation) => async <
	T extends { [key: string]: string }
>(
	StackName: string,
): Promise<T> => {
	const { Stacks } = await cf.describeStacks({ StackName }).promise()
	if (!Stacks || !Stacks.length || !Stacks[0].Outputs) {
		throw new Error(`Stack ${StackName} not found.`)
	}
	return toObject(Stacks[0].Outputs) as T
}

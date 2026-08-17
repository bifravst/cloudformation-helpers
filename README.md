# CloudFormation Helpers [![npm version](https://img.shields.io/npm/v/@bifravst/cloudformation-helpers.svg)](https://www.npmjs.com/package/@bifravst/cloudformation-helpers)

[![GitHub Actions](https://github.com/bifravst/cloudformation-helpers/workflows/Test%20and%20Release/badge.svg)](https://github.com/bifravst/cloudformation-helpers/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![@commitlint/config-conventional](https://img.shields.io/badge/%40commitlint-config--conventional-brightgreen)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![ESLint: TypeScript](https://img.shields.io/badge/ESLint-TypeScript-blue.svg)](https://github.com/typescript-eslint/typescript-eslint)

Helper functions which simplify working with AWS CloudFormation stacks.

## Installation

    npm i --save-dev --save-exact @bifravst/cloudformation-helpers

## Usage

### `cfnResponse`

`cfnResponse` implements sending custom resource responses.

```typescript
import { cfnResponse, ResponseStatus } from "@bifravst/cloudformation-helpers";
import { CloudFormationCustomResourceEvent } from "aws-lambda";

/**
 * Lambda creating a custom resource
 */
export const handler = async (
  event: CloudFormationCustomResourceEvent,
): Promise<void> => {
  // Create custom resource ...

  await cfnResponse({
    Status: ResponseStatus.SUCCESS,
    event,
    PhysicalResourceId: "MyCustomResource",
  });
};
```

## Node & NPM

This project requires Node.js `>=24.19.0 <25` and npm `>=12.0.2 <13` (enforced
via `check-node-version` on `npm install` and `npm ci`).

The check is skipped during `npm publish` and `npm pack`, because
`semantic-release` bundles its own npm (`@semantic-release/npm` depends on
`npm@^11.6.2`) and runs the publish with that version rather than the one
installed in CI.

## TypeScript 6 and 7

This repo
[runs TypeScript 6 and 7 side by side](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0),
[so that eslint works](https://github.com/typescript-eslint/typescript-eslint/issues/10940#issuecomment-4922812181).

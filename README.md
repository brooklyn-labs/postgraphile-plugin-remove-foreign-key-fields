# postgraphile-plugin-remove-foreign-key-fields

[![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/brooklyn-labs/postgraphile-plugin-remove-foreign-key-fields/node.js.yml?branch=main&label=Build)](https://github.com/brooklyn-labs/postgraphile-plugin-remove-foreign-key-fields/actions/workflows/node.js.yml)
[![npm (scoped)](https://img.shields.io/npm/v/@brooklyn-labs/postgraphile-plugin-remove-foreign-key-fields?label=NPM)](https://www.npmjs.com/package/@brooklyn-labs/postgraphile-plugin-remove-foreign-key-fields)
[![License](https://img.shields.io/github/license/brooklyn-labs/postgraphile-plugin-remove-foreign-key-fields?label=License)](https://github.com/brooklyn-labs/postgraphile-plugin-remove-foreign-key-fields/blob/main/LICENSE)

## Motivation

This PostGraphile plugin removes all foreign key fields from the GraphQL schema while still allowing foreign relationships to be created. Primary key fields (which may also be used as a foreign key) are not removed from the GraphQL schema.

Example

```graphql
type Person {
  id
  firstName
  lastName
  addressId
  address {
    id
    street
    city
    state
    postalCode
  }
}
```

This extension will remove `addressId` from the `Person` type in an effort to simplify the schema.

```graphql
type Person {
  id
  firstName
  lastName
  address {
    id
    street
    city
    state
    postalCode
  }
}
```

You can still get the address id through the `Address` type.

`Person->address->id`.

## Getting Started

Install npm package.

```shell
npm install postgraphile-plugin-remove-foreign-key-fields
```

Add plugin to postgraphile.

```js
import express from "express";
import { postgraphile } from "postgraphile";
import { RemoveForeignKeyFieldsPlugin } from "postgraphile-plugin-remove-foreign-key-fields";

const app = express();

// Add PostGraphile middleware.
app.use(
  postgraphile(`postgres://username:password@localhost:5432/postgres`, {
    appendPlugins: [RemoveForeignKeyFieldsPlugin],
  }),
);

// Start up server.
app.listen(3000, "localhost", 511, () => {
  logger.info(`🚀 Server listening at http://localhost:3000`);
});
```

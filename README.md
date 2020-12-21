# postgraphile-remove-foreign-key-fields-plugin

[![CircleCI](https://img.shields.io/circleci/build/github/jarvisuser90/postgraphile-remove-foreign-key-fields-plugin/main)](https://github.com/jarvisuser90/postgraphile-remove-foreign-key-fields-plugin)
[![npm version](https://img.shields.io/npm/v/postgraphile-remove-foreign-key-fields-plugin)](https://www.npmjs.com/package/postgraphile-remove-foreign-key-fields-plugin)

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
npm install postgraphile-remove-foreign-key-fields-plugin
```

Add plugin to postgraphile.

```js
import express from "express";
import { postgraphile } from "postgraphile";
import { RemoveForeignKeyFieldsPlugin } from "postgraphile-remove-foreign-key-fields-plugin";

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

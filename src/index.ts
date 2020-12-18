import { Plugin, SchemaBuilder } from "postgraphile";
import { PgClass, PgConstraint, PgAttribute } from "graphile-build-pg";
import omit from "lodash/omit";

/**
 * @description This PostGraphile plugin removes all foreign key fields from the GraphQL schema while still
 * allowing foreign relationships to be created. Primary key fields (which also are foreign keys) are not
 * removed from the GraphQL schema.
 * @param builder {SchemaBuilder} The schema builder.
 */
export const RemoveForeignKeyFieldsPlugin: Plugin = (
  builder: SchemaBuilder,
) => {
  builder.hook("GraphQLObjectType:fields", (fields, build, context) => {
    const {
      // Self,
      scope: { pgIntrospection: table },
    } = context;

    // We only want table objects. `class` represents a table.
    if (!table || table.kind !== "class") {
      return fields;
    }

    const { inflection } = build;
    const primaryKeyFields: string[] = [];
    const fieldsToOmit: string[] = [];

    // Get the primary key for the current table.
    (table as PgClass).constraints
      // `p` represents the primary key type.
      .filter((constraint: PgConstraint) => constraint.type === "p")

      // Iterate over all primary keys.
      .forEach((constraint: PgConstraint) => {
        // Iterate over all primary key fields. Could be one field or multiple fields
        // in the case of compound primary keys.
        constraint.keyAttributes.forEach((attribute: PgAttribute) => {
          // Debug logging.
          // console.debug(
          //   `Primary key field: ${Self.name}.${inflection.camelCase(
          //     attribute.name
          //   )}`
          // );

          // Primary key field.
          primaryKeyFields.push(attribute.name);
        });
      });

    // Get all foreign keys for the current table.
    (table as PgClass).constraints
      // `f` represents the foreign key type.
      .filter((constraint: PgConstraint) => constraint.type === "f")

      // Iterate over all foreign keys.
      .forEach((constraint: PgConstraint) => {
        // Iterate over all foreign key fields. Could be one field or multiple fields
        // in the case of compound foreign keys.
        constraint.keyAttributes.forEach((attribute: PgAttribute) => {
          // Check if field is a primary key field. If so, we don't want to
          // remove it from the GraphQL schema. The primary key fields are used
          // for identifying a record, filtering, etc.
          if (primaryKeyFields.includes(attribute.name)) {
            // Don't omit field.
            return;
          }

          // Transform field name to GraphQL property name.
          const fieldName = inflection.camelCase(attribute.name);

          // Debug logging.
          // console.debug(`Removing foreign key field: ${Self.name}.${fieldName}`);

          // Omit field.
          fieldsToOmit.push(fieldName);
        });
      });

    // Return a modified list without foreign key fields.
    return omit(fields, fieldsToOmit);
  });
};

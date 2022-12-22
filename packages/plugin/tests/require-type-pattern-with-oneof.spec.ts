import { GraphQLRuleTester } from '../src';
import { rule } from '../src/rules/require-type-pattern-with-oneof';

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests('require-type-pattern-with-oneof', rule, {
  valid: [
    /* GraphQL */ `
      type T @oneOf {
        ok: Ok
        error: Error
      }
    `,
    {
      name: 'should ignore types without `@oneOf` directive',
      code: /* GraphQL */ `
        type T {
          notok: Ok
          err: Error
        }
      `,
    },
    {
      name: 'should validate only `type` with `@oneOf` directive',
      code: /* GraphQL */ `
        input I {
          notok: Ok
          err: Error
        }
      `,
    },
  ],
  invalid: [
    {
      name: 'should validate `ok` field',
      code: /* GraphQL */ `
        type T @oneOf {
          notok: Ok
          error: Error
        }
      `,
      errors: [{ message: 'Type `T` should have `ok` field.' }],
    },
    {
      name: 'should validate `error` field',
      code: /* GraphQL */ `
        type T @oneOf {
          ok: Ok
          err: Error
        }
      `,
      errors: [{ message: 'Type `T` should have `error` field.' }],
    },
  ],
});
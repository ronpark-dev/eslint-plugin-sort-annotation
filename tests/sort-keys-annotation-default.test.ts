import path from 'path'

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils'

const { RuleTester } = ESLintUtils

import rule, { HAS_UNSORTED_KEYS_MESSAGE_ID } from '../src/rules/sort-keys-annotation'

const getFilename = (filePath: string): string => path.resolve('./tests', filePath)

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2015,
    project: getFilename('tsconfig.json'),
    sourceType: 'module',
  },
})

ruleTester.run('sort-keys-annotation', rule, {
  valid: [
    {
      code: `
      // @sort-keys
      const object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      type object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      export const object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      export type object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      enum Keys {
        A = 'A',
        B = 'B',
      }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      enum Keys {
        A,
        B,
        C = 1,
      }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      const A = 'A'
      const B = 'B'
      // @sort-keys
      const object = {
        '1': '1',
        '11': '11',
        '2': '2',
        '22': '22',
        a: 'a',
        b: 'b',
        [A]: 'A',
        [B]: 'B',
      }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      const A = 'A'
      const B = 'B'
      // @sort-keys
      interface MockInterface {
        '1': string
        '11': string
        '2': string
        '22': string
        a: string
        b: string
        [A]: string
        [B]: string
      }
      `,
      filename: getFilename('main.ts'),
    },
  ],
  invalid: [
    {
      code: `
      // @sort-keys
      const object = { b: string, a: string, }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ObjectExpression }],
      output: `
      // @sort-keys
      const object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      type object = { b: string, a: string, }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.TSTypeLiteral }],
      output: `
      // @sort-keys
      type object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      export const object = { b: string, a: string, }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ObjectExpression }],
      output: `
      // @sort-keys
      export const object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      export type object = { b: string, a: string, }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.TSTypeLiteral }],
      output: `
      // @sort-keys
      export type object = { a: string, b: string, }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      enum Keys {
        B = 'B',
        A = 'A',
      }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.TSEnumDeclaration }],
      output: `
      // @sort-keys
      enum Keys {
        A = 'A',
        B = 'B',
      }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      // @sort-keys
      enum Keys {
        B,
        C = 1,
        A,
      }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.TSEnumDeclaration }],
      output: `
      // @sort-keys
      enum Keys {
        A,
        B,
        C = 1,
      }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      const A = 'A'
      const B = 'B'
      // @sort-keys
      const object = {
        [B]: 'B',
        [A]: 'A',
        b: 'b',
        a: 'a',
        '22': '22',
        '2': '2',
        '11': '11',
        '1': '1',
      }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.ObjectExpression }],
      output: `
      const A = 'A'
      const B = 'B'
      // @sort-keys
      const object = {
        '1': '1',
        '11': '11',
        '2': '2',
        '22': '22',
        a: 'a',
        b: 'b',
        [A]: 'A',
        [B]: 'B',
      }
      `,
      filename: getFilename('main.ts'),
    },
    {
      code: `
      const A = 'A'
      const B = 'B'
      // @sort-keys
      interface MockInterface {
        [B]: string
        [A]: string
        b: string
        a: string
        '22': string
        '2': string
        '11': string
        '1': string
      }
      `,
      errors: [{ messageId: HAS_UNSORTED_KEYS_MESSAGE_ID, type: AST_NODE_TYPES.TSInterfaceBody }],
      output: `
      const A = 'A'
      const B = 'B'
      // @sort-keys
      interface MockInterface {
        '1': string
        '11': string
        '2': string
        '22': string
        a: string
        b: string
        [A]: string
        [B]: string
      }
      `,
      filename: getFilename('main.ts'),
    },
  ],
})

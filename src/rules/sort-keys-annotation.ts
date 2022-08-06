import { ArrayUtils } from '../utils/array'
import { ComparerUtils } from '../utils/comparer'
import { ConfigUtils } from '../utils/config'
import { createRule } from '../utils/createRule'
import { FixUtils } from '../utils/fix'

type Options = []

type MessageIds = 'hasUnsortedKeys'

export default createRule<Options, MessageIds>({
  name: 'sort-keys-annotation',
  meta: {
    docs: {
      description: 'Sort keys in object if annotated as @sort-keys',
      recommended: 'error',
      suggestion: true,
    },
    fixable: 'code',
    type: 'suggestion',
    schema: [],
    messages: {
      hasUnsortedKeys: `has unsorted keys`,
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      ObjectExpression(node): void {
        const commentExpectedEndLine = node.loc.start.line - 1

        const config = ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine)

        if (!config) {
          return
        }

        const { isReversed } = config

        const comparer = ComparerUtils.makeObjectPropertyComparer({ isReversed })

        const sortedProperties = [...node.properties].sort(comparer)

        const needSort = ArrayUtils.zip2(node.properties, sortedProperties).some(
          ([property, sortedProperty]) => property !== sortedProperty,
        )

        if (needSort) {
          const diffRanges = ArrayUtils.zip2(node.properties, sortedProperties).map(([from, to]) => ({
            from: from.range,
            to: to.range,
          }))

          const fixedText = FixUtils.getFixedText(sourceCode, node.range, diffRanges)

          context.report({
            node,
            messageId: 'hasUnsortedKeys',
            fix(fixer) {
              return fixer.replaceTextRange(node.range, fixedText)
            },
          })
        }
      },
      TSTypeLiteral(node): void {
        const commentExpectedEndLine = node.loc.start.line - 1

        const config = ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine)

        if (!config) {
          return
        }

        const { isReversed } = config

        const comparer = ComparerUtils.makeTypeLiteralPropertyComparer({ isReversed })

        const sortedMembers = [...node.members].sort(comparer)

        const needSort = ArrayUtils.zip2(node.members, sortedMembers).some(
          ([property, sortedProperty]) => property !== sortedProperty,
        )

        if (needSort) {
          const diffRanges = ArrayUtils.zip2(node.members, sortedMembers).map(([from, to]) => ({
            from: from.range,
            to: to.range,
          }))

          const fixedText = FixUtils.getFixedText(sourceCode, node.range, diffRanges)

          context.report({
            node,
            messageId: 'hasUnsortedKeys',
            fix(fixer) {
              return fixer.replaceTextRange(node.range, fixedText)
            },
          })
        }
      },
      TSInterfaceDeclaration(node): void {
        const commentExpectedEndLine = node.loc.start.line - 1

        const config = ConfigUtils.getConfig(sourceCode, '@sort-keys', commentExpectedEndLine)

        if (!config) {
          return
        }

        const { isReversed } = config

        const comparer = ComparerUtils.makeInterfacePropertyComparer({ isReversed })

        const properties = node.body.body

        const sortedProperties = [...properties].sort(comparer)

        const needSort = ArrayUtils.zip2(properties, sortedProperties).some(
          ([property, sortedProperty]) => property !== sortedProperty,
        )

        if (needSort) {
          const diffRanges = ArrayUtils.zip2(properties, sortedProperties).map(([from, to]) => ({
            from: from.range,
            to: to.range,
          }))

          const fixedText = FixUtils.getFixedText(sourceCode, node.range, diffRanges)

          context.report({
            node,
            messageId: 'hasUnsortedKeys',
            fix(fixer) {
              return fixer.replaceTextRange(node.range, fixedText)
            },
          })
        }
      },
    }
  },
})

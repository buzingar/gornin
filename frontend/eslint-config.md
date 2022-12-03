extends:

- airbnb

plugins:

- react
- destructuring-newline

parser:
babel-eslint

settings:
ecmascript: 6
react:
version: '16.8'

env:
browser: true
jest: true

globals:
I18n: readonly

rules:
arrow-body-style: 0
func-style: 0
func-names: 0
newline-per-chained-call: 0
padding-line-between-statements: [
"error",
{ blankLine: "always", prev: ["singleline-const", "let", "var"], next: "_"},
{ blankLine: "never", prev: ["singleline-const", "let", "var"], next: ["const", "let", "var"]},
{ blankLine: "always", prev: ["cjs-import"], next: "_"},
{ blankLine: "never", prev: ["cjs-import"], next: ["cjs-import"]},
{ blankLine: "always", prev: "\*", next: "return" }
]
no-empty: ["error", { "allowEmptyCatch": true }]
no-console: 0
no-nested-ternary: 0
no-param-reassign: 0
no-plusplus: 0
no-underscore-dangle: 0
no-multiple-empty-lines: [2, { "max": 1 }]
linebreak-style: 0
object-curly-newline: [2, { "multiline": true, "consistent": true }]
object-property-newline: [2, { "allowAllPropertiesOnSameLine": false }]
max-len: ["error", { "code": 180, "ignoreComments": true }]
curly: 0
import/no-extraneous-dependencies: 0
import/no-unresolved: 0
import/extensions: 0
import/prefer-default-export: 0
import/no-named-as-default: 0
import/no-commonjs: 2
space-return-throw-case: 0
complexity: 0
strict: [2, "never"]
no-confusing-arrow: 0
import/no-absolute-path: 0
react/sort-comp: [2, {
order: [
'everything-else',
'rendering',
],
groups: {
rendering: [
'/^render.+$/',
'render'
]
}
}]
import/no-cycle: 0
react/no-did-update-set-state: 0
react/no-string-refs: 0
react/prop-types: 0
react/jsx-indent: [2, 2, { checkAttributes: true, indentLogicalExpressions: true }]
react/jsx-filename-extension: [1, { "extensions": [".js", ".jsx"] }]
react/prefer-stateless-function: 0
react/destructuring-assignment: 0
react/jsx-fragments: 0
react/jsx-closing-bracket-location: [2, "after-props"]
react/jsx-curly-newline: 0
react/jsx-curly-spacing: [2, { "when": "always", "attributes": false, "children": true }]
react/jsx-wrap-multilines: ["error", {
"arrow": "parens-new-line",
"assignment": "parens-new-line",
"condition": "parens-new-line",
"declaration": "parens-new-line",
"logical": "parens-new-line",
"prop": "parens-new-line",
"return": "parens-new-line",
}]
react/state-in-constructor: 0
react/static-property-placement: 0
react/jsx-props-no-spreading: 0
react/jsx-one-expression-per-line: 0
jsx-a11y/click-events-have-key-events: 0
jsx-a11y/no-static-element-interactions: 0
jsx-a11y/no-noninteractive-tabindex: 0
jsx-a11y/alt-text: 0
jsx-a11y/no-noninteractive-element-interactions: 0
jsx-a11y/anchor-is-valid: 0
jsx-a11y/control-has-associated-label: 0
jsx-a11y/label-has-associated-control: 0
no-return-assign: [2, "except-parens"]
multiline-ternary: [2, "always-multiline"]

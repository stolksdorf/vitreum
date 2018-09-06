module.exports = {
	root : true,
	parser: 'babel-eslint',
	parserOptions : {
		ecmaVersion  : 2018,
		sourceType   : 'module',
		ecmaFeatures : {
			jsx : true,
		}
	},
	env : {
		browser : true,
	},
	plugins : ['react'],
	rules   : {
		/** Errors **/
		'camelcase'              : ['error', { properties: 'never' }],
		'no-array-constructor'   : 'error',
		'no-iterator'            : 'error',
		'no-nested-ternary'      : 'error',
		'no-new-object'          : 'error',
		'no-proto'               : 'error',
		'react/jsx-no-bind'      : ['error', { allowArrowFunctions: true }],
		'react/jsx-uses-react'   : 'error',
		'react/prefer-es6-class' : ['error', 'never'],
		'no-restricted-modules'  : ['error', { paths : [
			{
				name    : 'moment',
				message : 'Please use date-fns instead'
			},
			{
				name    : 'lodash',
				message : 'Please specify a subpackage of lodash to use'
			},
			{
				name    : 'lodash/core',
				message : 'Please specify a subpackage of lodash to use'
			},
		]}],

		/** Warnings **/
		'max-lines' : ['warn', {
			max            : 200,
			skipComments   : true,
			skipBlankLines : true,
		}],
		'max-depth'            : ['warn', { max: 4}],
		'max-params'           : ['warn', { max: 4 }],
		'no-restricted-syntax' : ['warn', 'ClassDeclaration', 'SwitchStatement'],
		'no-unused-vars'       : ['warn', {
			vars              : 'all',
			args              : 'none',
			varsIgnorePattern : 'config|cx'
		}],
		'react/jsx-uses-vars' : 'warn',

		/** Fixable **/
		'arrow-parens'    : ['warn', 'always'],
		'brace-style'     : ['warn', '1tbs', { allowSingleLine: true }],
		'jsx-quotes'      : ['warn', 'prefer-single'],
		'linebreak-style' : ['warn', 'unix'],
		'no-var'          : 'warn',
		'prefer-const'    : 'warn',
		'prefer-template' : 'warn',
		'quotes'          : ['warn', 'single', { 'allowTemplateLiterals': true } ],
		'semi'            : ['warn', 'always'],

		/** Whitespace **/
		'array-bracket-spacing' : ['warn', 'never'],
		'arrow-spacing'         : ['warn', { before: true, after: true }],
		'comma-spacing'         : ['warn', { before: false, after: true }],
		'comma-dangle'          : ['warn', 'always-multiline'],
		'indent'                : ['warn', 'tab'],
		'keyword-spacing'       : ['warn', {
			before    : true,
			after     : true,
			overrides : {
				if : { 'before': false, 'after': false }
			}
		}],
		'key-spacing' : ['warn', {
			multiLine  : { beforeColon: true, afterColon: true, align: 'colon' },
			singleLine : { beforeColon: true, afterColon: true }
		}],
		'linebreak-style'               : ['warn', 'unix'],
		'no-trailing-spaces'            : 'warn',
		'no-whitespace-before-property' : 'warn',
		'object-curly-spacing'          : ['warn', 'always'],
		'react/jsx-indent-props'        : ['warn', 'tab'],
		'space-in-parens'               : ['warn', 'never'],
		'space-infix-ops'               : [1],
		'template-curly-spacing'        : ['warn', 'never'],
	}
};
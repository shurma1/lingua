import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import importPlugin from "eslint-plugin-import"

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			"react-refresh/only-export-components": "off",
			
			"react-hooks/exhaustive-deps": "off",
			
			"quotes": ["error", "double", { "avoidEscape": true }],
			
			"indent": ["error", "tab", { "SwitchCase": 1 }],
			
			"max-len": ["error", {
				"code": 140,
				"tabWidth": 4,
				"ignoreUrls": true,
				"ignoreStrings": true,
				"ignoreTemplateLiterals": true,
				"ignoreRegExpLiterals": true,
				"ignoreComments": true
			}],
			
			"import/order": ["error", {
				"groups": [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
					"type"
				],
				"pathGroups": [
					{
						"pattern": "react",
						"group": "external",
						"position": "before"
					},
					{
						"pattern": "@/**",
						"group": "internal"
					}
				],
				"pathGroupsExcludedImportTypes": ["react"],
				"newlines-between": "always",
				"alphabetize": {
					"order": "asc",
					"caseInsensitive": true
				}
			}],
			
			"semi": ["error", "always"],
			
			"comma-dangle": ["error", "always-multiline"],
		},
	},
])

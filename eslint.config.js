import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import { defineConfig, globalIgnores } from "eslint/config"
import autoImports from "./.wxt/eslint-auto-imports.mjs"
import stylistic from "@stylistic/eslint-plugin"

export default defineConfig([
    autoImports,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: {
            js,
            "@stylistic": stylistic,
        },
        extends: ["js/recommended"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: { globals: globals.browser },
    },
    stylistic.configs.customize({
        indent: 4,
        quotes: "double",
        semi: false,
    }),
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat["jsx-runtime"],
    globalIgnores(["node_modules/*", ".output/*", ".wxt/*"]),
    {
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "react/jsx-no-undef": ["error", {
                allowGlobals: true,
            }],
        },
    },
])

import { configDefaults, defineConfig } from "vitest/config"
import { WxtVitest } from "wxt/testing/vitest-plugin"

export default defineConfig({
    plugins: [WxtVitest()],
    test: { exclude: [
        ...configDefaults.exclude,
        "**/e2e/**",
        "**/*.spec.ts",
    ] },
})

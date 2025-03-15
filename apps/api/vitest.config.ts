import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const [tsConfigPathsModule, swcModule] = await Promise.all([
    import("vite-tsconfig-paths"),
    import("unplugin-swc"),
  ]);

  const tsConfigPaths = tsConfigPathsModule.default;
  const swc = swcModule.default;

  return {
    test: {
      globals: true,
      root: "./",
    },
    envDir: "./env",
    plugins: [
      tsConfigPaths(),
      swc.vite({
        module: { type: "es6" },
      }),
    ],
  };
});

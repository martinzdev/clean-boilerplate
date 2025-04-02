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
      include: ["**/infra/**/*.e2e-spec.ts"],
      globals: true,
      root: "./",
      setupFiles: ["./test/setup-e2e.ts"],
    },
    plugins: [
      tsConfigPaths(),
      swc.vite({
        module: { type: "es6" },
      }),
    ],
  };
});

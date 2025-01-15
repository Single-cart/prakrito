import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/**.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  dts: true,
  outDir: "dist",
});

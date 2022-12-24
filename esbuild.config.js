import * as path from "path";
import glob from "glob"
import esbuild from "esbuild"

;(async function () {
  const entries = {}

  glob.sync("./src/**/*.js")
    .forEach((file) => {
  	  // strips app/javascript/entrypoints from the key.
      const key = path.relative("src", path.join(path.dirname(file), path.basename(file, path.extname(file))))
      const value = "." + path.sep + path.join(path.dirname(file), path.basename(file, path.extname(file)))
      console.log({key, value})
      entries[key] = value
    });

  console.log(entries)

  const defaultConfig = {
    entryPoints: ["./src/index.js"],
    sourcemap: true,
    platform: "browser",
    target: "es2018",
    watch: process.argv.includes("--watch"),
    color: true,
    bundle: true,
    external: []
  }

  const startTime = Number(new Date())

  await Promise.all[
    // esbuild.build({
    //   ...defaultConfig,
    //   outfile: "dist/bundle/index.common.js",
    //   format: "cjs",
    //   minify: true,
    // }),
    //
    // esbuild.build({
    //   ...defaultConfig,
    //   outfile: "dist/bundle/index.module.js",
    //   format: "esm",
    //   minify: true,
    // }),

    esbuild.build({
      ...defaultConfig,
      entryPoints: entries,
      outdir: 'dist',
      format: 'esm',
      target: "es2020",
      external: ['./node_modules/*'],
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]'
    })
  ]

  const endTime = Number(new Date())
  const buildTime = endTime - startTime

  console.log(`Build complete in ${buildTime}ms! ✨`)
})()

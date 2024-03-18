// @ts-check
// import { expandTypesPlugin } from './expand-types.js'

const globs = ['exports/**/*.{d.ts,js}', 'internal/**/*.{d.ts,js}', 'types/**/*.d.ts']

let typechecker = null

export default {
  /** Globs to analyze */
  globs,
  /** Globs to exclude */
  exclude: [
    // 'node_modules',
    'docs'
  ],
  /** Directory to output CEM to */
  outdir: '.',
  /** Run in dev mode, provides extra logging */
  dev: process.argv.includes("--verbose"),
  /** Run in watch mode, runs on file changes */
  watch: process.argv.includes("--watch"),
  /** Include third party custom elements manifests */
  dependencies: false,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: true,
  /** Enable special handling for litelement */
  litelement: true,
  /** Enable special handling for catalyst */
  catalyst: false,
  /** Enable special handling for fast */
  fast: false,
  /** Enable special handling for stencil */
  stencil: false,
  overrideModuleCreation: ({ts, globs}) => {
    const configFileName = ts.findConfigFile(
      "./",
      ts.sys.fileExists,
      "tsconfig.json"
    );
    const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
    const {fileNames, options} = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      "./"
    );

    let program = ts.createProgram(fileNames, options);
    let typeChecker = program.getTypeChecker();

    return program.getSourceFiles().filter(sf => globs.find(glob => sf.fileName.includes(glob)));
  },
}

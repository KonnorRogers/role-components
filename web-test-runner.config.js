import { playwrightLauncher } from '@web/test-runner-playwright';
// import { esbuildPlugin } from '@web/dev-server-esbuild';

/** @type {import("@web/test-runner").TestRunnerConfig} */
export default {
  rootDir: '.',
  files: ['./tests/**/*.test.js'], // "default" group
  concurrentBrowsers: 3,
  nodeResolve: true,
  testFramework: {
    config: {
      ui: 'tdd',
      timeout: 3000,
      retries: 1
    }
  },
  plugins: [

  ],
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        headless: !(Boolean(["true"].includes(process.env.DEBUG)))
      }
    }),
    playwrightLauncher({ product: 'firefox', concurrency: 1 }),
    playwrightLauncher({ product: 'webkit' })
  ],
}

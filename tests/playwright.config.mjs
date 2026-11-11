import { defineConfig, devices } from '@playwright/test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.mjs',
  fullyParallel: true,
  timeout: 40_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8765',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'python3 -m http.server 8765 --directory public/ui-preview',
    cwd: repoRoot,
    url: 'http://127.0.0.1:8765/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  },
  outputDir: 'test-results'
});

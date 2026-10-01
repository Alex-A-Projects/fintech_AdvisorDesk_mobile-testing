/**
 * wdio.shared.conf.ts — configuration shared by both platform configs.
 *
 * WebdriverIO v9 expects each platform config to extend this and pick
 * its own capabilities. This file is imported by `wdio.android.conf.ts`
 * and `wdio.ios.conf.ts`.
 *
 * What lives here:
 *   - test-runner + framework defaults
 *   - reporters (spec + allure for portfolio)
 *   - default timeouts
 *   - an `afterTest` hook that saves a screenshot to `allure-results/`
 *     on every failure, named after the test title so multiple failures
 *     don't overwrite each other.
 *
 * Why no `webServer`: the Playwright project's `webServer` block is
 * swapped for a `npm run server` script the user starts manually (in
 * a second terminal). WebdriverIO does not manage an `http-server`
 * sidecar the way Playwright does, and keeping the demo process under
 * the user's hands makes failure diagnosis easier.
 */
import { browser } from '@wdio/globals';
import type { Options } from '@wdio/types';

export const config: Partial<Options.Testrunner> = {
    runner: 'local',
    //
    // ========================
    // Test files / framework
    // ========================
    specs: ['./tests/**/*.spec.ts'],
    exclude: ['./tests/api/**/*.spec.ts'],
    maxInstancesPerCapability: 1,
    //
    // ===============
    // WDIO frameworks
    // ===============
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60_000,
    },
    //
    // ==================
    // Reporters
    // ==================
    reporters: [
        'spec',
        ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true }],
    ],
    //
    // ===================
    // Default timeouts
    // ===================
    waitforTimeout: 10_000,
    connectionRetryTimeout: 120_000,
    connectionRetryCount: 3,
    //
    // ===================
    // Global hooks
    // ===================
    afterTest: async function (test, _context, { error }) {
        if (error) {
            // Save a screenshot on failure so a CI run produces useful
            // evidence. The file is keyed by the test's full title so
            // concurrent failures don't trample each other.
            const safe = test.fullTitle.replace(/[^a-z0-9]+/gi, '_');
            await browser.saveScreenshot(`./allure-results/${safe}.png`).catch(() => undefined);
        }
    },
};
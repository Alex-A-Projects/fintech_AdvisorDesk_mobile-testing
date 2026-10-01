/**
 * Allure runtime configuration. Loaded by @wdio/allure-reporter.
 *
 * The actual reporter is configured inside wdio.shared.conf.ts so
 * tests stay self-bootstrapping; this file exists so the Allure
 * CLI (`allure generate`) picks up the title and report dir when
 * generating the HTML report from raw results.
 */
export const allure = {
  title: process.env.REPORT_TITLE ?? 'AdvisorDesk Mobile-Web Test Report',
  resultsDir: './allure-results',
  reportDir: './allure-report',
};

export default allure;
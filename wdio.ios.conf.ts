/**
 * wdio.ios.conf.ts — runs the suite against iPhone 17 Pro on iOS 26
 * via XCUITest (Safari).
 *
 * Pre-requisites (not committed):
 *   - appium server reachable at http://localhost:4723
 *   - Xcode + an iPhone 17 Pro simulator already booted
 *
 * Override the appium endpoint by setting APPIUM_HOST / APPIUM_PORT.
 */
import { config as sharedConfig } from './wdio.shared.conf';

export const config = {
    ...sharedConfig,
    hostname: process.env.APPIUM_HOST ?? 'localhost',
    port: Number(process.env.APPIUM_PORT ?? 4723),
    path: '/wd/hub',
    services: ['appium'],
    capabilities: [
        {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'appium:browserName': 'Safari',
            'appium:deviceName': process.env.IOS_DEVICE ?? 'iPhone 17 Pro',
            'appium:platformVersion': process.env.IOS_VERSION ?? '26.0',
            'appium:udid': process.env.IOS_UDID,
            'appium:newCommandTimeout': 240,
            'appium:autoWebview': true,
            'appium:ensureWebviewsHavePages': true,
            'appium:nativeWebScreenshot': true,
            // iOS Simulator-side locale/locale settings.
            'appium:processArguments': {
                args: [
                    '-AppleLanguages',
                    '(en-US)',
                    '-AppleLocale',
                    'en_US',
                ],
            },
            // Safari-mobile user agent for the iPhone 17 Pro.
            'safari:deviceUserAgent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) ' +
                'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 ' +
                'Mobile/23A350 Safari/604.1',
        },
    ],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60_000,
    },
};
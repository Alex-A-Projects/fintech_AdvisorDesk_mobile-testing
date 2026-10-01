/**
 * wdio.android.conf.ts — runs the suite against a Samsung Galaxy S25
 * (or any recent Pixel / Galaxy running Android 15+) via UiAutomator2.
 *
 * Pre-requisites (not committed):
 *   - appium server reachable at http://localhost:4723
 *   - an Android emulator already booted (e.g. Galaxy S25 / API 35)
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
            //
            // ===================
            // Browser-side
            // ===================
            // We test AdvisorDesk's *mobile web* app (the same HTML rendered
            // through Chrome). To swap to a native app, change `browserName`
            // to 'Application' and provide an `app` capability.
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:browserName': 'Chrome',
            'appium:deviceName': process.env.ANDROID_DEVICE ?? 'Samsung Galaxy S25',
            'appium:platformVersion': process.env.ANDROID_OS ?? '15',
            'appium:udid': process.env.ANDROID_UDID,
            'appium:newCommandTimeout': 240,
            'appium:autoGrantPermissions': true,
            'appium:noReset': false,
            'appium:ensureWebviewsHavePages': true,
            'appium:nativeWebScreenshot': true,
            //
            // Mobile-emulated viewport that matches the Galaxy S25
            // (393×852 CSS px ≈ ~6.2" diagonal at 412dpi).
            'goog:chromeOptions': {
                args: [
                    '--window-size=393,852',
                    '--force-device-scale-factor=2.625',
                ],
                mobileEmulation: {
                    deviceMetrics: {
                        width: 393,
                        height: 852,
                        pixelRatio: 2.625,
                        touch: true,
                        mobile: true,
                    },
                    userAgent:
                        'Mozilla/5.0 (Linux; Android 15; SM-S931) AppleWebKit/537.36 ' +
                        '(KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
                },
            },
        },
    ],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60_000,
    },
};
/**
 * Environment configuration. Single source of truth for the local
 * AdvisorDesk URL, Appium endpoint, and a couple of mobile-tuned
 * timeouts. Read once at module load.
 *
 * The values are pulled from `process.env` (loaded by `dotenv` at the
 * top of `wdio.shared.conf.ts`) so a CI box can override them via
 * environment variables without editing source.
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export interface Environment {
    name: string;
    baseUrl: string;
    appium: {
        host: string;
        port: number;
    };
    ios: {
        device: string;
        version: string;
        udid?: string;
    };
    android: {
        device: string;
        os: string;
        udid?: string;
    };
    reportTitle: string;
}

const env = (key: string, fallback?: string): string => {
    const v = process.env[key];
    if (v === undefined || v === '') {
        if (fallback === undefined) throw new Error(`Missing required env var: ${key}`);
        return fallback;
    }
    return v;
};

export const environment: Environment = {
    name: env('TEST_ENV', 'staging'),
    baseUrl: env('BASE_URL', 'http://localhost:8765/demo.html'),
    appium: {
        host: env('APPIUM_HOST', 'localhost'),
        port: parseInt(env('APPIUM_PORT', '4723'), 10),
    },
    ios: {
        device: env('IOS_DEVICE', 'iPhone 17 Pro'),
        version: env('IOS_VERSION', '26.0'),
        udid: process.env.IOS_UDID,
    },
    android: {
        device: env('ANDROID_DEVICE', 'Samsung Galaxy S25'),
        os: env('ANDROID_OS', '15'),
        udid: process.env.ANDROID_UDID,
    },
    reportTitle: env('REPORT_TITLE', 'AdvisorDesk Mobile-Web Test Report'),
};

export const TEST_DATA = {
    validClient: {
        name: 'Acme Capital LLC',
        company: 'Acme Capital',
        email: 'contact@acme.example',
        phone: '+1-555-0100',
        status: 'active' as const,
        source: 'Referral',
        address: '123 Wall St, NY',
    },
    validProject: {
        name: 'Q4 Portfolio Review',
        stage: 'in_progress' as const,
        value: 12500,
    },
    validTask: {
        title: 'Send monthly statement',
        priority: 'high' as const,
    },
};